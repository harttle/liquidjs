import { Value } from './value'
import { TemplateImpl } from '../template/template-impl'
import { Template } from '../template/template'
import { Context } from '../context/context'
import { Emitter } from '../emitters/emitter'
import { OutputToken } from '../tokens/output-token'
import { Liquid } from '../liquid'

export class Output extends TemplateImpl<OutputToken> implements Template {
  private value: Value
  public constructor (token: OutputToken, liquid: Liquid) {
    super(token)
    this.value = new Value(token.content, liquid)
  }
  public * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }
}
