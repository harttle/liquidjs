import { Tokenizer, assert, TagImplOptions, TagToken, Context } from '../../types'

export default {
  parse: function (token: TagToken) {
    const tokenizer = new Tokenizer(token.args)
    this.key = tokenizer.readWord().content
    tokenizer.skipBlank()
    assert(tokenizer.peek() === '=', () => `illegal token ${token.getText()}`)
    tokenizer.advance()
    this.value = tokenizer.remaining()
  },
  render: function * (ctx: Context) {
    ctx.bottom()[this.key] = yield this.liquid._evalValue(this.value, ctx)
  }
} as TagImplOptions
