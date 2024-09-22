import { isFunction } from '../util'
import { Hash } from './hash'
import { Tag, TagClass, TagRenderReturn } from './tag'
import { TagToken, TopLevelToken } from '../tokens'
import { Emitter } from '../emitters'
import { Context } from '../context'
import type { Liquid } from '../liquid'

export interface TagImplOptions {
  [key: string]: any
  parse?: (this: Tag & TagImplOptions, token: TagToken, remainingTokens: TopLevelToken[]) => void;
  render: (this: Tag & TagImplOptions, ctx: Context, emitter: Emitter, hash: Record<string, any>) => TagRenderReturn;
}

export function createTagClass (options: TagImplOptions): TagClass {
  return class extends Tag {
    constructor (token: TagToken, tokens: TopLevelToken[], liquid: Liquid) {
      super(token, tokens, liquid)
      if (isFunction(options.parse)) {
        options.parse.call(this, token, tokens)
      }
    }
    * render (ctx: Context, emitter: Emitter): TagRenderReturn {
      const hash = (yield new Hash(this.token.args, ctx.opts.keyValueSeparator).render(ctx)) as Record<string, any>
      return yield options.render.call(this, ctx, emitter, hash)
    }
  }
}
