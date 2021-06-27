import { assert, Tokenizer, Emitter, Hash, TagToken, TopLevelToken, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'
import { parseFilePath, renderFilePath } from './render'

export default {
  parseFilePath,
  renderFilePath,
  parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)
    this['file'] = this.parseFilePath(tokenizer, this.liquid)
    this.hash = new Hash(tokenizer.remaining())
    this.tpls = this.liquid.parser.parse(remainTokens)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, file } = this
    const { renderer } = liquid
    if (file === null) {
      ctx.setRegister('blockMode', BlockMode.OUTPUT)
      const html = yield renderer.renderTemplates(this.tpls, ctx)
      emitter.write(html)
      return
    }
    const filepath = yield this.renderFilePath(this['file'], ctx, liquid)
    assert(filepath, () => `illegal filename "${filepath}"`)
    const templates = yield liquid.parseFileImpl(filepath, ctx.sync)

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
