import { evalValue } from 'src/render/syntax'
import Scope from 'src/scope/scope'
import { FilterImpl } from './filter-impl'

export default class Filter {
  name: string
  impl: FilterImpl
  args: string[]
  private static impls: {[key: string]: FilterImpl} = {}

  constructor (name: string, args: string[], strictFilters: boolean) {
    const impl = Filter.impls[name]
    if (!impl && strictFilters) throw new TypeError(`undefined filter: ${name}`)

    this.name = name
    this.impl = impl || (x => x)
    this.args = args
  }
  render (value: any, scope: Scope): any {
    const args = this.args.map(arg => evalValue(arg, scope))
    return this.impl.apply(null, [value, ...args])
  }
  static register (name: string, filter: FilterImpl) {
    Filter.impls[name] = filter
  }
  static clear () {
    Filter.impls = {}
  }
}
