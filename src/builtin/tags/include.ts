import { assert } from '../../util/assert'
import { Expression, Hash, Emitter, TagToken, Context, ITagImplOptions } from '../../types'
import { value, quotedLine } from '../../parser/lexical'
import BlockMode from '../../context/block-mode'

const staticFileRE = /[^\s,]+/
const withRE = new RegExp(`with\\s+(${value.source})`)

export default {
  parse: function (token: TagToken) {
    let match = staticFileRE.exec(token.args)
    if (match) this.staticValue = match[0]

    match = value.exec(token.args)
    if (match) this.value = match[0]

    match = withRE.exec(token.args)
    if (match) this.with = match[1]
  },
  render: function * (ctx: Context, hash: Hash, emitter: Emitter) {
    let filepath
    if (ctx.opts.dynamicPartials) {
      if (quotedLine.exec(this.value)) {
        const template = this.value.slice(1, -1)
        filepath = yield this.liquid._parseAndRender(template, ctx.getAll(), ctx.opts, ctx.sync)
      } else {
        filepath = yield new Expression(this.value).value(ctx)
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
      hash[filepath] = yield new Expression(this.with).evaluate(ctx)
    }
    const templates = yield this.liquid._parseFile(filepath, ctx.opts, ctx.sync)
    ctx.push(hash)
    yield this.liquid.renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
    ctx.setRegister('blocks', originBlocks)
    ctx.setRegister('blockMode', originBlockMode)
  }
} as ITagImplOptions
