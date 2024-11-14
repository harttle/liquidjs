import { Template, Value } from '.'
import { isKeyValuePair } from '../parser/filter-arg'
import { PropertyAccessToken, ValueToken } from '../tokens'
import {
  isNumberToken,
  isPropertyAccessToken,
  isQuotedToken,
  isRangeToken,
  isString,
  isValueToken,
  isWordToken,
  StaticAnalysisError
} from '../util'

/**
 * Row, column and file name where a variable was found.
 */
export interface VariableLocation {
  row: number;
  col: number;
  file?: string;
}

/**
 * A string representation of a template variable along with its segments
 * and location.
 */
export class Variable extends String {
  constructor (
    readonly segments: Array<string | number | Variable>,
    readonly location: VariableLocation
  ) {
    super(segmentsString(segments))
  }
}

/**
 * Property names and array indexes that make up a path to a variable.
 */
export type VariableSegments = Array<string | number | Variable>;

/**
 * A mapping of variable names or paths to an array of locations at which the
 * variable was found.
 */
export type Variables = { [key: string]: Variable };

/**
 * A custom map that groups variables by their string representation.
 */
class VariableMap extends Map<Variable | string, Variable[]> {
  get (key: Variable): Variable[] {
    const k = segmentsString(key.segments)
    if (!this.has(k)) {
      this.set(k, [])
    }
    return super.get(k) || []
  }

  has (key: string | Variable): boolean {
    if (key instanceof Variable) {
      return super.has(segmentsString(key.segments))
    }
    return super.has(key)
  }

  push (variable: Variable): void {
    this.get(variable).push(variable)
  }

  asObject (): Variables {
    return Object.fromEntries(this)
  }
}

/**
 * The result of calling `analyze()`.
 */
export interface StaticAnalysis {
  /**
   * All variables, whether they are in scope or not. Including references to names
   * such as `forloop` from the `for` tag.
   */
  variables: Variables;

  /**
   * Variables that are not in scope. These could be a "global" variables that are
   * expected to be provided by the application developer, or possible mistakes
   * from the template author.
   *
   * If a variable is referenced before and after assignment, you should expect
   * that variable to be included in `globals`, `variables` and `locals`, each with
   * a different location.
   */
  globals: Variables;

  /**
   * Template variables that are added to the template local scope using tags like
   * `assign`, `capture` or `increment`.
   */
  locals: Variables;
}

/**
 * Statically analyze a template and report variable usage.
 */
export function analyze (templates: Template[]): StaticAnalysis {
  const variables = new VariableMap()
  const globals = new VariableMap()
  const locals = new VariableMap()

  const templateScope: Set<string> = new Set()
  const scope = new DummyScope(templateScope)

  function updateVariables (variable: Variable): void {
    variables.push(variable)

    // Variables that are not in scope are assumed to be global, that is,
    // provided by application developers.
    const root = variable.segments[0]
    if (isString(root) && !scope.has(root)) {
      globals.push(variable)
    }

    // recurse for nested Variables
    for (const segment of variable.segments) {
      if (segment instanceof Variable) {
        updateVariables(segment)
      }
    }
  }

  function visit (template: Template): void {
    if (template.node === undefined) {
      throw new StaticAnalysisError(
        'tag does not implement `node()`',
        template.token
      )
    }

    const node = template.node()

    for (const value of node.values) {
      for (const variable of extractVariables(value)) {
        updateVariables(variable)
      }
    }

    for (const key of node.templateScope) {
      // Names added to the scope by tags like `assign`, `capture` and `increment`.
      templateScope.add(key)
      // XXX: This is the row and col of the node as some names (like 'tablerow') don't have a token.
      const [row, col] = node.token.getPosition()
      locals.push(new Variable([key], { row, col, file: node.token.file }))
    }

    if (node.blockScope) {
      scope.push(new Set(node.blockScope))
    }

    for (const template of node.children) {
      visit(template)
    }

    scope.pop()
  }

  for (const template of templates) {
    visit(template)
  }

  return {
    variables: variables.asObject(),
    globals: globals.asObject(),
    locals: locals.asObject()
  }
}

/**
 * A stack to manage scopes while traversing templates during static analysis.
 */
class DummyScope {
  private stack: Array<Set<string>>

  constructor (globals?: Set<string>) {
    this.stack = globals ? [globals] : []
  }

  public has (key: string): boolean {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i].has(key)) {
        return true
      }
    }
    return false
  }

  public push (scope: Set<string>): void {
    this.stack.push(scope)
  }

  public pop (): Set<string> | undefined {
    return this.stack.pop()
  }
}

function * extractVariables (value: Value | ValueToken): Generator<Variable> {
  if (isValueToken(value)) {
    yield * extractValueTokenVariables(value)
  } else {
    yield * extractFilteredValueVariables(value)
  }
}

function * extractFilteredValueVariables (value: Value): Generator<Variable> {
  for (const token of value.initial.postfix) {
    if (isValueToken(token)) {
      yield * extractValueTokenVariables(token)
    }
  }

  for (const filter of value.filters) {
    for (const arg of filter.args) {
      if (isKeyValuePair(arg) && arg[1]) {
        yield * extractValueTokenVariables(arg[1])
      } else if (isValueToken(arg)) {
        yield * extractValueTokenVariables(arg)
      }
    }
  }
}

function * extractValueTokenVariables (token: ValueToken): Generator<Variable> {
  if (isRangeToken(token)) {
    yield * extractValueTokenVariables(token.lhs)
    yield * extractValueTokenVariables(token.rhs)
  } else if (isPropertyAccessToken(token)) {
    yield extractPropertyAccessVariable(token)
  } else if (
    isNumberToken(token) ||
    isWordToken(token)
  ) {
    const [row, col] = token.getPosition()
    yield new Variable([token.content], {
      row,
      col,
      file: token.file
    })
  }
}

function extractPropertyAccessVariable (token: PropertyAccessToken): Variable {
  const segments: VariableSegments = []

  if (isQuotedToken(token.variable) || isNumberToken(token.variable)) {
    segments.push(token.variable.content)
  }

  for (const prop of token.props) {
    if (isQuotedToken(prop) || isNumberToken(prop) || isWordToken(prop)) {
      segments.push(prop.content)
    } else if (isPropertyAccessToken(prop)) {
      segments.push(extractPropertyAccessVariable(prop))
    }
  }

  const [row, col] = token.getPosition()
  return new Variable(segments, {
    row,
    col,
    file: token.file
  })
}

// This is used to detect segments that can be represented with dot notation
// when creating a string representation of VariableSegments.
const RE_PROPERTY = /^[\u0080-\uFFFFa-zA-Z_][\u0080-\uFFFFa-zA-Z0-9_-]*$/

/**
 * Return a string representation of segments using dot notation where possible.
 */
function segmentsString (segments: VariableSegments): string {
  const buf: string[] = []

  const root = segments[0]
  if (root instanceof Variable) {
    buf.push(segmentsString(root.segments))
  } else if (isString(root)) {
    if (root.match(RE_PROPERTY)) {
      buf.push(`${root}`)
    } else {
      buf.push(`['${root}']`)
    }
  }

  for (const segment of segments.slice(1)) {
    if (segment instanceof Variable) {
      buf.push(`[${segmentsString(segment.segments)}]`)
    } else if (isString(segment)) {
      if (segment.match(RE_PROPERTY)) {
        buf.push(`.${segment}`)
      } else {
        buf.push(`['${segment}']`)
      }
    } else {
      buf.push(`[${segment}]`)
    }
  }

  return buf.join('')
}
