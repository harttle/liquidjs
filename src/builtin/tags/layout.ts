import { assert } from '../../util/assert'
import { value as rValue } from '../../parser/lexical'
import { Emitter, Hash, Expression, TagToken, Token, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'

const staticFileRE = /\S+/

export default {
  parse: function (token: TagToken, remainTokens: Token[]) {
    let match = staticFileRE.exec(token.args)
    if (match) {
      this.staticLayout = match[0]
    }

    match = rValue.exec(token.args)
    if (match) {
      this.layout = match[0]
    }

    this.tpls = this.liquid.parser.parse(remainTokens)
  },
  render: function * (ctx: Context, hash: Hash, emitter: Emitter) {
    const layout = ctx.opts.dynamicPartials
      ? yield new Expression(this.layout).value(ctx)
      : this.staticLayout
    assert(layout, `cannot apply layout with empty filename`)

    // render the remaining tokens immediately
    ctx.setRegister('blockMode', BlockMode.STORE)
    const blocks = ctx.getRegister('blocks')
    const r = this.liquid.renderer
    const html = yield r.renderTemplates(this.tpls, ctx)
    if (blocks[''] === undefined) {
      blocks[''] = html
    }
    const templates = yield this.liquid._parseFile(layout, ctx.opts, ctx.sync)
    ctx.push(hash)
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const partial = yield r.renderTemplates(templates, ctx)
    ctx.pop()
    emitter.write(partial)
  }
} as TagImplOptions
