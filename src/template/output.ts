import { Value } from './value'
import { FilterMap } from './filter/filter-map'
import { stringify, toValue } from '../util/underscore'
import { TemplateImpl } from '../template/template-impl'
import { Template } from '../template/template'
import { Context } from '../context/context'
import { Emitter } from '../render/emitter'
import { OutputToken } from '../parser/output-token'

export class Output extends TemplateImpl<OutputToken> implements Template {
  private value: Value
  public constructor (token: OutputToken, filters: FilterMap) {
    super(token)
    this.value = new Value(token.value, filters)
  }
  public * render (ctx: Context, emitter: Emitter) {
    const val = yield this.value.value(ctx)
    emitter.write(stringify(toValue(val)))
  }
}
