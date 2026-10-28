import { Liquid, TopLevelToken, Emitter, Value, TagToken, Context, Tag } from '..'
import { Arguments } from '../template'
import { toValue } from '../util'

export default class extends Tag {
  private value?: Value

  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.tokenizer.skipBlank()
    if (!this.tokenizer.end()) {
      this.value = new Value(this.tokenizer.readFilteredValue(), this.liquid)
    }
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    if (!this.value) return
    let val = yield toValue(yield this.value.value(ctx, false))
    const outputEscape = this.liquid.options.outputEscape
    if (outputEscape && !this.value.filters[this.value.filters.length - 1]?.raw) {
      val = yield outputEscape.call({ context: ctx, token: this.token, liquid: this.liquid }, val)
    }
    emitter.write(val)
  }

  public * arguments (): Arguments {
    if (this.value) {
      yield this.value
    }
  }
}
