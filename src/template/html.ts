import { Template } from '../template/template'
import { ITemplate } from '../template/itemplate'
import { HTMLToken } from '../parser/html-token'
import { Context } from '../context/context'
import { Emitter } from '../render/emitter'

export class HTML extends Template<HTMLToken> implements ITemplate {
  private str: string
  public constructor (token: HTMLToken) {
    super(token)
    this.str = token.value
  }
  public renderSync (ctx: Context, emitter: Emitter) {
    emitter.write(this.str)
  }
  public async render (ctx: Context, emitter: Emitter) {
    this.renderSync(ctx, emitter)
  }
}
