import { create, stringify } from '../../util/underscore'
import assert from '../../util/assert'
import Scope from '../../scope/scope'
import ITagImpl from './itag-impl'
import ITagImplOptions from './itag-impl-options'
import Liquid from '../../liquid'
import Hash from './hash'
import Template from '../../template/template'
import ITemplate from '../../template/itemplate'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'

export default class Tag extends Template<TagToken> implements ITemplate {
  name: string
  private impl: ITagImpl
  static impls: { [key: string]: ITagImplOptions } = {}

  constructor (token: TagToken, tokens: Token[], liquid: Liquid) {
    super(token)
    this.name = token.name

    const impl = Tag.impls[token.name]
    assert(impl, `tag ${token.name} not found`)
    this.impl = create<ITagImplOptions, ITagImpl>(impl)
    this.impl.liquid = liquid
    if (this.impl.parse) {
      this.impl.parse(token, tokens)
    }
  }
  async render (scope: Scope) {
    const hash = await Hash.create(this.token.args, scope)
    const impl = this.impl
    if (typeof impl.render !== 'function') {
      return ''
    }
    const html = await impl.render(scope, hash)
    return stringify(html)
  }
  static register (name: string, tag: ITagImplOptions) {
    Tag.impls[name] = tag
  }
  static clear () {
    Tag.impls = {}
  }
}
