import { TagImplOptions } from './tag-impl-options'
import { assert } from '../../util/assert'

export class TagMap {
  private impls: {[key: string]: TagImplOptions} = {}

  get (name: string) {
    const impl = this.impls[name]
    assert(impl, () => `tag "${name}" not found`)
    return impl
  }

  set (name: string, impl: TagImplOptions) {
    this.impls[name] = impl
  }
}
