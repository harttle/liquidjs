import { assert, evalQuotedToken, TypeGuards, evalToken, Tokenizer, Emitter, Hash, TagToken, TopLevelToken, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'

export default {
  parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
    const tokenizer = new Tokenizer(token.args)
    const file = this.liquid.options.dynamicPartials ? tokenizer.readValue() : tokenizer.readFileName()
    assert(file, () => `illegal argument "${token.args}"`)

    this.file = file
    this.hash = new Hash(tokenizer.remaining())
    this.tpls = this.liquid.parser.parse(remainTokens)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, file } = this
    const { renderer } = liquid
    const filepath = ctx.opts.dynamicPartials
      ? (TypeGuards.isQuotedToken(file)
        ? yield renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)
        : evalToken(this.file, ctx))
      : file.getText()
    assert(filepath, () => `illegal filename "${file.getText()}":"${filepath}"`)

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
