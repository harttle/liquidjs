import { stringify, isFunction } from '../../util/underscore'
import assert from '../../util/assert'
import Context from '../../context/context'
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

    this.impl = Object.create(impl)
    this.impl.liquid = liquid
    if (this.impl.parse) {
      this.impl.parse(token, tokens)
    }
  }
  async render (ctx: Context) {
    const hash = await Hash.create(this.token.args, ctx)
    const impl = this.impl
    return isFunction(impl.render) ? stringify(await impl.render(ctx, hash)) : ''
  }
  static register (name: string, tag: ITagImplOptions) {
    Tag.impls[name] = tag
  }
  static clear () {
    Tag.impls = {}
  }
}
