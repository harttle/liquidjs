import { assert } from '../../util/assert'
import { Expression, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'
import { quoted, value, quotedLine } from '../../parser/lexical'
import BlockMode from '../../context/block-mode'

const rFile = new RegExp(`^(${quoted.source}|[^\\s,]+)(?:\\s+with\\s+(${value.source}))?`)

export default {
  parse: function (token: TagToken) {
    const match = rFile.exec(token.args)
    if (!match) {
      throw new Error(`illegal argument "${token.args}"`)
    }
    this.file = match[1]
    this.hash = new Hash(token.args.slice(match[0].length))
    this.withVar = match[2]
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, withVar, file } = this
    const { renderer } = liquid
    const filepath = ctx.opts.dynamicPartials
      ? (quotedLine.exec(file)
        ? yield renderer.renderTemplates(liquid.parse(file.slice(1, -1)), ctx)
        : yield new Expression(file).value(ctx))
      : file
    assert(filepath, `illegal filename "${file}":"${filepath}"`)

    const saved = ctx.saveRegister('blocks', 'blockMode')
    ctx.setRegister('blocks', {})
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const scope = yield hash.render(ctx)
    if (withVar) scope[filepath] = yield new Expression(withVar).evaluate(ctx)
    const templates = yield liquid._parseFile(filepath, ctx.opts, ctx.sync)
    ctx.push(scope)
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
    ctx.restoreRegister(saved)
  }
} as TagImplOptions
