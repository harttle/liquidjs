import { Liquid, TopLevelToken, Emitter, Value, TagToken, Context, Tag } from '..'
import { Arguments } from '../template'

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
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }

  public arguments (): Arguments {
    return this.value ? [this.value] : []
  }
}
