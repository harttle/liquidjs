import { FilterImplOptions } from './filter-impl-options'
import { Filter, FilterArgs } from './filter'
import { assert } from '../../util/assert'

export class FilterMap {
  private impls: {[key: string]: FilterImplOptions} = {}

  constructor (private readonly strictFilters: boolean) {}

  get (name: string) {
    const impl = this.impls[name]
    assert(impl || !this.strictFilters, `undefined filter: ${name}`)
    return impl
  }

  set (name: string, impl: FilterImplOptions) {
    this.impls[name] = impl
  }

  create (name: string, args: FilterArgs) {
    return new Filter(name, this.get(name), args)
  }
}
