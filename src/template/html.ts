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
  public render (ctx: Context, emitter: Emitter) {
    emitter.write(this.str)
  }
}
