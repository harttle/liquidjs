import { Emitter } from '../../emitters/emitter'
import { TagImplOptions, TagToken, Context } from '../../types'
import { Tokenizer } from '../../parser/tokenizer'

export default {
  parse: function (token: TagToken) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)
    const tokens = tokenizer.readLiquidTagTokens(this.liquid.options)
    this.tpls = this.liquid.parser.parseTokens(tokens)
  },
  render: function * (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter)
  }
} as TagImplOptions
