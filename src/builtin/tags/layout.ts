import assert from '../../util/assert'
import { value as rValue } from '../../parser/lexical'
import { evalValue } from '../../render/syntax'
import BlockMode from '../../context/block-mode'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Context from '../../context/context'
import Hash from '../../template/tag/hash'
import ITagImplOptions from '../../template/tag/itag-impl-options'

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
  render: async function (ctx: Context, hash: Hash) {
    const layout = ctx.opts.dynamicPartials
      ? await evalValue(this.layout, ctx)
      : this.staticLayout
    assert(layout, `cannot apply layout with empty filename`)

    // render the remaining tokens immediately
    ctx.setRegister('blockMode', BlockMode.STORE)
    const blocks = ctx.getRegister('blocks')
    const html = await this.liquid.renderer.renderTemplates(this.tpls, ctx)
    if (blocks[''] === undefined) {
      blocks[''] = html
    }
    const templates = await this.liquid.getTemplate(layout, ctx.opts)
    ctx.push(hash)
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const partial = await this.liquid.renderer.renderTemplates(templates, ctx)
    ctx.pop()
    return partial
  }
} as ITagImplOptions
