import { evalValue } from '../../render/syntax'
import Context from '../../context/context'
import { isArray } from '../../util/underscore'
import { FilterImplOptions } from './filter-impl-options'

export type FilterArgs = Array<string|[string?, string?]>

export class Filter {
  name: string
  impl: FilterImplOptions
  args: FilterArgs
  private static impls: {[key: string]: FilterImplOptions} = {}

  constructor (name: string, args: FilterArgs, strictFilters: boolean) {
    const impl = Filter.impls[name]
    if (!impl && strictFilters) throw new TypeError(`undefined filter: ${name}`)

    this.name = name
    this.impl = impl || (x => x)
    this.args = args
  }
  async render (value: any, context: Context) {
    const argv: any[] = []
    for (const arg of this.args) {
      if (isArray(arg)) argv.push([arg[0], await evalValue(arg[1], context)])
      else argv.push(await evalValue(arg, context))
    }
    return this.impl.apply({ context }, [value, ...argv])
  }
  static register (name: string, filter: FilterImplOptions) {
    Filter.impls[name] = filter
  }
  static clear () {
    Filter.impls = {}
  }
}
