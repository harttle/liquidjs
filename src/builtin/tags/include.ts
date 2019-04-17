import assert from '../../util/assert'
import { value, quotedLine } from '../../parser/lexical'
import { evalValue } from '../../render/syntax'
import BlockMode from '../../context/block-mode'
import TagToken from '../../parser/tag-token'
import Context from '../../context/context'
import Hash from '../../template/tag/hash'
import ITagImplOptions from '../../template/tag/itag-impl-options'

const staticFileRE = /[^\s,]+/
const withRE = new RegExp(`with\\s+(${value.source})`)

export default <ITagImplOptions>{
  parse: function (token: TagToken) {
    let match = staticFileRE.exec(token.args)
    if (match) {
      this.staticValue = match[0]
    }

    match = value.exec(token.args)
    if (match) {
      this.value = match[0]
    }

    match = withRE.exec(token.args)
    if (match) {
      this.with = match[1]
    }
  },
  render: async function (ctx: Context, hash: Hash) {
    let filepath
    if (ctx.opts.dynamicPartials) {
      if (quotedLine.exec(this.value)) {
        const template = this.value.slice(1, -1)
        filepath = await this.liquid.parseAndRender(template, ctx.getAll(), ctx.opts)
      } else {
        filepath = await evalValue(this.value, ctx)
      }
    } else {
      filepath = this.staticValue
    }
    assert(filepath, `cannot include with empty filename`)

    const originBlocks = ctx.getRegister('blocks')
    const originBlockMode = ctx.getRegister('blockMode')

    ctx.setRegister('blocks', {})
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    if (this.with) {
      hash[filepath] = await evalValue(this.with, ctx)
    }
    const templates = await this.liquid.getTemplate(filepath, ctx.opts)
    ctx.push(hash)
    const html = await this.liquid.renderer.renderTemplates(templates, ctx)
    ctx.pop()
    ctx.setRegister('blocks', originBlocks)
    ctx.setRegister('blockMode', originBlockMode)
    return html
  }
}
