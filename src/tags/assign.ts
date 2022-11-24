import { Value, assert, Tokenizer, Liquid, TopLevelToken, TagToken, Context, Tag } from '..'
export default class extends Tag {
  private key: string
  private value: Value

  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const tokenizer = new Tokenizer(token.args, liquid.options.operators)
    this.key = tokenizer.readIdentifier().content
    tokenizer.skipBlank()
    assert(tokenizer.peek() === '=', () => `illegal token ${token.getText()}`)
    tokenizer.advance()
    this.value = new Value(tokenizer.remaining(), this.liquid)
  }
  * render (ctx: Context): Generator<unknown, void, unknown> {
    ctx.bottom()[this.key] = yield this.value.value(ctx, this.liquid.options.lenientIf)
  }
}
