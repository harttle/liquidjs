import { isFunction } from '../../util/underscore'
import { assert } from '../../util/assert'
import { Liquid } from '../../liquid'
import { Template } from '../../template/template'
import { Emitter, Hash, Context, ITagImplOptions, TagToken, ITemplate, Token } from '../../types'
import { ITagImpl } from './itag-impl'

export class Tag extends Template<TagToken> implements ITemplate {
  public name: string
  private impl: ITagImpl
  private static impls: { [key: string]: ITagImplOptions } = {}

  public constructor (token: TagToken, tokens: Token[], liquid: Liquid) {
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
  public * render (ctx: Context, emitter: Emitter) {
    const hash = yield Hash.create(this.token.args, ctx)
    const impl = this.impl
    if (isFunction(impl.render)) return yield impl.render(ctx, hash, emitter)
  }
  public static register (name: string, tag: ITagImplOptions) {
    Tag.impls[name] = tag
  }
  public static clear () {
    Tag.impls = {}
  }
}
