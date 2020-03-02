import { assert } from '../../util/assert'
import { Expression, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'
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
    assert(filepath, `cannot render with empty filename`)

    const originBlocks = ctx.getRegister('blocks')
    const originBlockMode = ctx.getRegister('blockMode')

    const childCtx = new Context({}, ctx.opts, ctx.sync)
    childCtx.setRegister('blocks', {})
    childCtx.setRegister('blockMode', BlockMode.OUTPUT)
    if (this.with) {
      hash[filepath] = yield new Expression(this.with).evaluate(ctx)
    }
    childCtx.push(hash)
    const templates = yield this.liquid._parseFile(filepath, childCtx.opts, childCtx.sync)
    yield this.liquid.renderer.renderTemplates(templates, childCtx, emitter)

    childCtx.setRegister('blocks', originBlocks)
    childCtx.setRegister('blockMode', originBlockMode)
  }
} as TagImplOptions
