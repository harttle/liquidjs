import { Template } from '.'
import { isValueToken, StaticAnalysisError } from '../util'

export interface Location {
  row: number;
  col: number;
  file?: string;
}

export type Locations = {[key: string]: Location[]};

export interface StaticAnalysis {
  variables: Locations;
  globals: Locations;
  locals: Locations;
}

export function analyze (templates: Template[]): StaticAnalysis {
  const variables: Locations = {}
  const globals: Locations = {}
  const locals: Locations = {}

  const templateScope: {[key: string]: any} = {}
  const blockScope = new SimpleScope()

  function visit (template: Template): void {
    if (template.node === undefined) {
      throw new StaticAnalysisError('tag does not implement `node()`', template.token)
    }

    const node = template.node()

    // TODO:
    // for (const value of node.values) {
    //   if (isValueToken(value) && )
    // }

    templateScope.push(...node.templateScope)

    if (node.blockScope) {
      blockScope.push(new Set(node.blockScope))
    }

    for (const template of node.children) {
      visit(template)
    }

    blockScope.pop()
  }

  for (const template of templates) {
    visit(template)
  }

  return {
    variables,
    globals,
    locals
  }
}

class SimpleScope {
  private scopes: Array<Set<string>>

  constructor (globals?: Set<string>) {
    this.scopes = globals ? [globals] : []
  }

  public has (key: string): boolean {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(key)) {
        return true
      }
    }
    return false
  }

  public push (scope: Set<string>): void {
    this.scopes.push(scope)
  }

  public pop (): Set<string> | undefined {
    return this.scopes.pop()
  }
}
