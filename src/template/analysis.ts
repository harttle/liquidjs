import { Argument, Template, Value } from '.'
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
  toPromise,
  toValueSync
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
 * A variable's segments as an array, possibly with nested arrays of segments.
 */
export type SegmentArray = Array<string | number | SegmentArray>

/**
 * A variable's segments and location, which can be coerced to a string.
 */
export class Variable {
  constructor (
    readonly segments: Array<string | number | Variable>,
    readonly location: VariableLocation
  ) {}

  public toString (): string {
    return segmentsString(this.segments, true)
  }

  /** Return this variable's segments as an array, possibly with nested arrays for nested paths. */
  public toArray (): SegmentArray {
    function * _visit (...segments: Array<string | number | Variable>): Generator<string | number | SegmentArray> {
      for (const segment of segments) {
        if (segment instanceof Variable) {
          yield Array.from(_visit(...segment.segments))
        } else {
          yield segment
        }
      }
    }
    return Array.from(_visit(...this.segments))
  }
}

/**
 * Property names and array indexes that make up a path to a variable.
 */
export type VariableSegments = Array<string | number | Variable>;

/**
 * A mapping of variable names to an array of locations at which the variable was found.
 */
export type Variables = { [key: string]: Variable[] };

/**
 * Group variables by the string representation of their root segment.
 */
export class VariableMap {
  private map: Map<string, Variable[]>

  constructor () {
    this.map = new Map()
  }

  public get (key: Variable): Variable[] {
    const k = segmentsString([key.segments[0]])
    if (!this.map.has(k)) {
      this.map.set(k, [])
    }
    return this.map.get(k) as Variable[]
  }

  public has (key: Variable): boolean {
    return this.map.has(segmentsString([key.segments[0]]))
  }

  public push (variable: Variable): void {
    this.get(variable).push(variable)
  }

  public asObject (): Variables {
    return Object.fromEntries(this.map)
  }
}

/**
 * The result of calling `analyze()` or `analyzeSync()`.
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

export interface StaticAnalysisOptions {
  /**
   * When `true` (the default), try to load partial templates and analyze them too.
   */
  partials?: boolean;
}

export const defaultStaticAnalysisOptions: StaticAnalysisOptions = {
  partials: true
}

function * _analyze (templates: Template[], partials: boolean, sync: boolean): Generator<unknown, StaticAnalysis> {
  const variables = new VariableMap()
  const globals = new VariableMap()
  const locals = new VariableMap()

  const rootScope = new DummyScope(new Set())

  // Names of partial templates that we've already analyzed.
  const seen: Set<string | undefined> = new Set()

  function updateVariables (variable: Variable, scope: DummyScope) {
    variables.push(variable)
    const aliased = scope.alias(variable)

    if (aliased !== undefined) {
      const root = aliased.segments[0]
      // TODO: What if a a template renders a rendered template? Do we need scope.parent?
      if (isString(root) && !rootScope.has(root)) {
        globals.push(aliased)
      }
    } else {
      const root = variable.segments[0]
      if (isString(root) && !scope.has(root)) {
        globals.push(variable)
      }
    }

    // Recurse for nested Variables
    for (const segment of variable.segments) {
      if (segment instanceof Variable) {
        updateVariables(segment, scope)
      }
    }
  }

  function * visit (template: Template, scope: DummyScope): Generator<unknown, void> {
    if (template.arguments) {
      for (const arg of template.arguments()) {
        for (const variable of extractVariables(arg)) {
          updateVariables(variable, scope)
        }
      }
    }

    if (template.localScope) {
      for (const ident of template.localScope()) {
        scope.add(ident.content)
        scope.deleteAlias(ident.content)
        const [row, col] = ident.getPosition()
        locals.push(new Variable([ident.content], { row, col, file: ident.file }))
      }
    }

    if (template.children) {
      if (template.partialScope) {
        const partial = template.partialScope()

        if (partial === undefined) {
          // Layouts, for example, can have children that are not partials.
          for (const child of (yield template.children(partials, sync)) as Template[]) {
            yield visit(child, scope)
          }
          return
        }

        if (seen.has(partial.name)) return

        const partialScopeNames: Set<string> = new Set()
        const partialScope = partial.isolated
          ? new DummyScope(partialScopeNames)
          : scope.push(partialScopeNames)

        for (const name of partial.scope) {
          if (isString(name)) {
            partialScopeNames.add(name)
          } else {
            const [alias, argument] = name
            partialScopeNames.add(alias)
            const variables = Array.from(extractVariables(argument))
            if (variables.length) {
              partialScope.setAlias(alias, variables[0].segments)
            }
          }
        }

        for (const child of (yield template.children(partials, sync)) as Template[]) {
          yield visit(child, partialScope)
          seen.add(partial.name)
        }

        partialScope.pop()
      } else {
        if (template.blockScope) {
          scope.push(new Set(template.blockScope()))
        }

        for (const child of (yield template.children(partials, sync)) as Template[]) {
          yield visit(child, scope)
        }

        if (template.blockScope) {
          scope.pop()
        }
      }
    }
  }

  for (const template of templates) {
    yield visit(template, rootScope)
  }

  return {
    variables: variables.asObject(),
    globals: globals.asObject(),
    locals: locals.asObject()
  }
}

/**
 * Statically analyze a template and report variable usage.
 */
export function analyze (template: Template[], options: StaticAnalysisOptions = {}): Promise<StaticAnalysis> {
  const opts = { ...defaultStaticAnalysisOptions, ...options } as Required<StaticAnalysisOptions>
  return toPromise(_analyze(template, opts.partials, false))
}

/**
 * Statically analyze a template and report variable usage.
 */
export function analyzeSync (template: Template[], options: StaticAnalysisOptions = {}): StaticAnalysis {
  const opts = { ...defaultStaticAnalysisOptions, ...options } as Required<StaticAnalysisOptions>
  return toValueSync(_analyze(template, opts.partials, true))
}

interface ScopeStackItem {
  names: Set<string>;
  aliases: Map<string, VariableSegments>;
}

/**
 * A stack to manage scopes while traversing templates during static analysis.
 */
class DummyScope {
  private stack: Array<ScopeStackItem>

  constructor (globals: Set<string>) {
    this.stack = [{ names: globals, aliases: new Map() }]
  }

  /** Return true if `name` is in scope.  */
  public has (name: string): boolean {
    for (const scope of this.stack) {
      if (scope.names.has(name)) {
        return true
      }
    }
    return false
  }

  public push (scope: Set<string>): DummyScope {
    this.stack.push({ names: scope, aliases: new Map() })
    return this
  }

  public pop (): Set<string> | undefined {
    return this.stack.pop()?.names
  }

  // Add a name to the template scope.
  public add (name: string): void {
    this.stack[0].names.add(name)
  }

  /** Return the variable that `variable` aliases, or `variable` if it doesn't alias anything. */
  public alias (variable: Variable): Variable | undefined {
    const root = variable.segments[0]
    if (!isString(root)) return undefined
    const alias = this.getAlias(root)
    if (alias === undefined) return undefined
    return new Variable([...alias, ...variable.segments.slice(1)], variable.location)
  }

  // TODO: `from` could be a path with multiple segments, like `include.x`.
  public setAlias (from: string, to: VariableSegments): void {
    this.stack[this.stack.length - 1].aliases.set(from, to)
  }

  public deleteAlias (name: string): void {
    this.stack[this.stack.length - 1].aliases.delete(name)
  }

  private getAlias (name: string): VariableSegments | undefined {
    for (const scope of this.stack) {
      if (scope.aliases.has(name)) {
        return scope.aliases.get(name)
      }

      // If a scope has defined `name`, then it masks aliases in parent scopes.
      if (scope.names.has(name)) {
        return undefined
      }
    }
    return undefined
  }
}

function * extractVariables (value: Argument): Generator<Variable> {
  if (isValueToken(value)) {
    yield * extractValueTokenVariables(value)
  } else if (value instanceof Value) {
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
  }
}

function extractPropertyAccessVariable (token: PropertyAccessToken): Variable {
  const segments: VariableSegments = []

  // token is not guaranteed to have `file` set. We'll try to get it from a prop if not.
  let file: string | undefined = token.file

  // Here we're flattening the first segment of a path if it is a nested path.
  const root = token.props[0]
  file = file || root.file
  if (isQuotedToken(root) || isNumberToken(root) || isWordToken(root)) {
    segments.push(root.content)
  } else if (isPropertyAccessToken(root)) {
    // Flatten paths that start with a nested path.
    segments.push(...extractPropertyAccessVariable(root).segments)
  }

  for (const prop of token.props.slice(1)) {
    file = file || prop.file
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
    file
  })
}

// This is used to detect segments that can be represented with dot notation
// when creating a string representation of VariableSegments.
const RE_PROPERTY = /^[\u0080-\uFFFFa-zA-Z_][\u0080-\uFFFFa-zA-Z0-9_-]*$/

/**
 * Return a string representation of segments using dot notation where possible.
 * @param segments - The property names and array indices that make up a path to a variable.
 * @param bracketedRoot - If false (the default), don't surround the root segment with square brackets.
 */
function segmentsString (segments: VariableSegments, bracketedRoot = false): string {
  const buf: string[] = []

  const root = segments[0]
  if (isString(root)) {
    if (!bracketedRoot || root.match(RE_PROPERTY)) {
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
