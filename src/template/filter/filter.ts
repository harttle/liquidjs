import { evalValue } from '../../render/syntax'
import Scope from '../../scope/scope'
import { isArray } from '../../util/underscore'
import { FilterImpl } from './filter-impl'

export type FilterArgs = Array<string|[string?, string?]>

export class Filter {
  name: string
  impl: FilterImpl
  args: FilterArgs
  private static impls: {[key: string]: FilterImpl} = {}

  constructor (name: string, args: FilterArgs, strictFilters: boolean) {
    const impl = Filter.impls[name]
    if (!impl && strictFilters) throw new TypeError(`undefined filter: ${name}`)

    this.name = name
    this.impl = impl || (x => x)
    this.args = args
  }
  async render (value: any, scope: Scope) {
    const argv: any[] = []
    for(let arg of this.args) {
      if (isArray(arg)) argv.push([arg[0], await evalValue(arg[1], scope)])
      else argv.push(await evalValue(arg, scope))
    }
    return this.impl.apply(null, [value, ...argv])
  }
  static register (name: string, filter: FilterImpl) {
    Filter.impls[name] = filter
  }
  static clear () {
    Filter.impls = {}
  }
}
