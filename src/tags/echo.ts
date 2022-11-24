import { Liquid, TopLevelToken, Emitter, Value, TagToken, Context, Tag } from '..'

export default class extends Tag {
  private value: Value
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.value = new Value(token.args, this.liquid)
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }
}
