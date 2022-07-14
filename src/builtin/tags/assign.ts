import { Value, Tokenizer, assert, TagImplOptions, TagToken, Context } from '../../types'

export default {
  parse: function (token: TagToken) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)
    this.key = tokenizer.readIdentifier().content
    tokenizer.skipBlank()
    assert(tokenizer.peek() === '=', () => `illegal token ${token.getText()}`)
    tokenizer.advance()
    this.value = new Value(tokenizer.remaining(), this.liquid)
  },
  render: function * (ctx: Context): Generator<unknown, void, unknown> {
    ctx.bottom()[this.key] = yield this.value.value(ctx, this.liquid.options.lenientIf)
  }
} as TagImplOptions
