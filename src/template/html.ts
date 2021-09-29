import { TemplateImpl } from '../template/template-impl'
import { Template } from '../template/template'
import { HTMLToken } from '../tokens/html-token'
import { Context } from '../context/context'
import { Emitter } from '../emitters/emitter'

export class HTML extends TemplateImpl<HTMLToken> implements Template {
  private str: string
  public constructor (token: HTMLToken) {
    super(token)
    this.str = token.getContent()
  }
  public * render (ctx: Context, emitter: Emitter): IterableIterator<void> {
    emitter.write(this.str)
  }
}
