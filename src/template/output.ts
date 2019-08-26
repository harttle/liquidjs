import { Value } from './value'
import { stringify, toValue } from '../util/underscore'
import { Template } from '../template/template'
import { ITemplate } from '../template/itemplate'
import { Context } from '../context/context'
import { Emitter } from '../render/emitter'
import { OutputToken } from '../parser/output-token'

export class Output extends Template<OutputToken> implements ITemplate {
  private value: Value
  public constructor (token: OutputToken, strictFilters: boolean) {
    super(token)
    this.value = new Value(token.value, strictFilters)
  }
  public renderSync (ctx: Context, emitter: Emitter) {
    const val = this.value.valueSync(ctx)
    emitter.write(stringify(toValue(val)))
  }
  public async render (ctx: Context, emitter: Emitter) {
    const val = await this.value.value(ctx)
    emitter.write(stringify(toValue(val)))
  }
}
