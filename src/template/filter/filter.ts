import { evalValue } from '../../render/syntax'
import Context from '../../context/context'
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
  async render (value: any, ctx: Context) {
    const argv: any[] = []
    for (const arg of this.args) {
      if (isArray(arg)) argv.push([arg[0], await evalValue(arg[1], ctx)])
      else argv.push(await evalValue(arg, ctx))
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
