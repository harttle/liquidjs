import { TemplateImpl, Template, MetaNode } from '../template'
import { HTMLToken } from '../tokens'
import { Context } from '../context'
import { Emitter } from '../emitters'

export class HTML extends TemplateImpl<HTMLToken> implements Template {
  private str: string
  public constructor (token: HTMLToken) {
    super(token)
    this.str = token.getContent()
  }
  public * render (ctx: Context, emitter: Emitter): IterableIterator<void> {
    emitter.write(this.str)
  }

  public node (): MetaNode {
    return {
      token: this.token,
      values: [],
      children: [],
      blockScope: [],
      templateScope: []
    }
  }
}
