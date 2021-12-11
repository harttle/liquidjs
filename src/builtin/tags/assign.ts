import { Tokenizer, assert, TagImplOptions, TagToken, Context } from '../../types'

export default {
  parse: function (token: TagToken) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)
    this.key = tokenizer.readIdentifier().content
    tokenizer.skipBlank()
    assert(tokenizer.peek() === '=', () => `illegal token ${token.getText()}`)
    tokenizer.advance()
    this.value = tokenizer.remaining()
  },
  render: function * (ctx: Context): Generator<unknown, void, unknown> {
    ctx.bottom()[this.key] = yield this.liquid._evalValue(this.value, ctx)
  }
} as TagImplOptions
