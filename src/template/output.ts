import { Value } from './value'
import { FilterMap } from './filter/filter-map'
import { stringify, toValue } from '../util/underscore'
import { TemplateImpl } from '../template/template-impl'
import { Template } from '../template/template'
import { Context } from '../context/context'
import { Emitter } from '../render/emitter'
import { OutputToken } from '../tokens/output-token'
import { Liquid } from '../liquid'

export class Output extends TemplateImpl<OutputToken> implements Template {
  private value: Value
  public constructor (token: OutputToken, filters: FilterMap, liquid: Liquid) {
    super(token)
    this.value = new Value(token.content, filters, liquid)
  }
  public * render (ctx: Context, emitter: Emitter) {
    const val = yield this.value.value(ctx)
    emitter.write(stringify(toValue(val)))
  }
}
