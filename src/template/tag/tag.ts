import { isFunction } from '../../util/underscore'
import { Liquid } from '../../liquid'
import { TemplateImpl } from '../../template/template-impl'
import { Emitter, Hash, Context, TagToken, Template, TopLevelToken } from '../../types'
import { TagImpl } from './tag-impl'
import { HashValue } from './hash'

export class Tag extends TemplateImpl<TagToken> implements Template {
  public name: string
  private impl: TagImpl

  public constructor (token: TagToken, tokens: TopLevelToken[], liquid: Liquid) {
    super(token)
    this.name = token.name

    const impl = liquid.tags.get(token.name)

    this.impl = Object.create(impl)
    this.impl.liquid = liquid
    if (this.impl.parse) {
      this.impl.parse(token, tokens)
    }
  }
  public * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, HashValue | unknown> {
    const hash = (yield new Hash(this.token.args).render(ctx)) as HashValue
    const impl = this.impl
    if (isFunction(impl.render)) return yield impl.render(ctx, emitter, hash)
  }
}
