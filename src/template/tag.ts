import { TemplateImpl } from './template-impl'
import type { Emitter } from '../emitters/emitter'
import type { Context } from '../context/context'
import type { TopLevelToken, TagToken } from '../tokens'
import type { Template } from './template'
import type { Liquid } from '../liquid'

export type TagRenderReturn = Generator<unknown, unknown, unknown> | Promise<unknown> | unknown

export abstract class Tag extends TemplateImpl<TagToken> implements Template {
  public name: string
  public liquid: Liquid

  public constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token)
    this.name = token.name
    this.liquid = liquid
  }
  public abstract render (ctx: Context, emitter: Emitter): TagRenderReturn;
}

export interface TagClass {
  new(token: TagToken, tokens: TopLevelToken[], liquid: Liquid): Tag
}
