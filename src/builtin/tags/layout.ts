import { assert, evalQuotedToken, TypeGuards, evalToken, Tokenizer, Emitter, Hash, TagToken, TopLevelToken, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'

export default {
  parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)
    const file = this.liquid.options.dynamicPartials ? tokenizer.readValue() : tokenizer.readFileName()
    assert(file, () => `illegal argument "${token.args}"`)

    this.file = file
    this.hash = new Hash(tokenizer.remaining())
    this.tpls = this.liquid.parser.parse(remainTokens)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, file } = this
    const { renderer } = liquid
    if (file.getText() === 'none') {
      ctx.setRegister('blockMode', BlockMode.OUTPUT)
      const html = yield renderer.renderTemplates(this.tpls, ctx)
      emitter.write(html)
      return
    }
    const filepath = ctx.opts.dynamicPartials
      ? (TypeGuards.isQuotedToken(file)
        ? yield renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)
        : evalToken(this.file, ctx))
      : file.getText()
    assert(filepath, () => `file "${file.getText()}"("${filepath}") not available`)
    const templates = yield liquid._parseFile(filepath, ctx.opts, ctx.sync)

    // render remaining contents and store rendered results
    ctx.setRegister('blockMode', BlockMode.STORE)
    const html = yield renderer.renderTemplates(this.tpls, ctx)
    const blocks = ctx.getRegister('blocks')
    if (blocks[''] === undefined) blocks[''] = () => html
    ctx.setRegister('blockMode', BlockMode.OUTPUT)

    // render the layout file use stored blocks
    ctx.push(yield hash.render(ctx))
    const partial = yield renderer.renderTemplates(templates, ctx)
    ctx.pop()
    emitter.write(partial)
  }
} as TagImplOptions
