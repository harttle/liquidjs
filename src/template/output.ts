import { Value } from './value'
import { Template, TemplateImpl } from '../template'
import { Context } from '../context/context'
import { Emitter } from '../emitters/emitter'
import { OutputToken } from '../tokens/output-token'
import { Tokenizer } from '../parser'
import { Liquid } from '../liquid'
import { Filter } from './filter'

export class Output extends TemplateImpl<OutputToken> implements Template {
  value: Value
  public constructor (token: OutputToken, liquid: Liquid) {
    super(token)
    const tokenizer = new Tokenizer(token.input, liquid.options.operators, token.file, token.contentRange)
    this.value = new Value(tokenizer.readFilteredValue(), liquid)
    const filters = this.value.filters
    const outputEscape = liquid.options.outputEscape
    if (!filters[filters.length - 1]?.raw && outputEscape) {
      filters.push(new Filter(toString.call(outputEscape), outputEscape, [], liquid))
    }
  }
  public * render (ctx: Context, emitter: Emitter): IterableIterator<unknown> {
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }
}
