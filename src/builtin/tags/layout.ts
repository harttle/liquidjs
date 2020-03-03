import { assert } from '../../util/assert'
import { quotedLine, quoted } from '../../parser/lexical'
import { Emitter, Hash, Expression, TagToken, Token, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'

const rFile = new RegExp(`^(${quoted.source}|[^\\s,]+)`)

export default {
  parse: function (token: TagToken, remainTokens: Token[]) {
    const match = rFile.exec(token.args)
    if (!match) {
      throw new Error(`illegal argument "${token.args}"`)
    }
    this.file = match[1]
    this.hash = new Hash(token.args.slice(match[0].length))
    this.tpls = this.liquid.parser.parse(remainTokens)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, file } = this
    const { renderer } = liquid
    const filepath = ctx.opts.dynamicPartials
      ? (quotedLine.exec(file)
        ? yield renderer.renderTemplates(liquid.parse(file.slice(1, -1)), ctx)
        : yield new Expression(file).value(ctx))
      : this.file
    assert(filepath, `illegal filename "${file}":"${filepath}"`)

    // render the remaining tokens immediately
    ctx.setRegister('blockMode', BlockMode.STORE)
    const blocks = ctx.getRegister('blocks')
    const html = yield renderer.renderTemplates(this.tpls, ctx)
    if (blocks[''] === undefined) blocks[''] = html
    const templates = yield liquid._parseFile(filepath, ctx.opts, ctx.sync)
    ctx.push(yield hash.render(ctx))
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const partial = yield renderer.renderTemplates(templates, ctx)
    ctx.pop()
    emitter.write(partial)
  }
} as TagImplOptions
