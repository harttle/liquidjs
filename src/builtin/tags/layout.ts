import { assert, Tokenizer, Emitter, Hash, TagToken, TopLevelToken, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'
import { parseFilePath, renderFilePath } from './render'
import { BlankDrop } from '../../drop/blank-drop'

export default {
  parseFilePath,
  renderFilePath,
  parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)
    this['file'] = this.parseFilePath(tokenizer, this.liquid)
    this['currentFile'] = token.file
    this.hash = new Hash(tokenizer.remaining())
    this.tpls = this.liquid.parser.parseTokens(remainTokens)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, file } = this
    const { renderer } = liquid
    if (file === null) {
      ctx.setRegister('blockMode', BlockMode.OUTPUT)
      yield renderer.renderTemplates(this.tpls, ctx, emitter)
      return
    }
    const filepath = yield this.renderFilePath(this['file'], ctx, liquid)
    assert(filepath, () => `illegal filename "${filepath}"`)
    const templates = yield liquid._parseLayoutFile(filepath, ctx.sync, this['currentFile'])

    // render remaining contents and store rendered results
    ctx.setRegister('blockMode', BlockMode.STORE)
    const html = yield renderer.renderTemplates(this.tpls, ctx)
    const blocks = ctx.getRegister('blocks')

    // set whole content to anonymous block if anonymous doesn't specified
    if (blocks[''] === undefined) blocks[''] = (parent: BlankDrop, emitter: Emitter) => emitter.write(html)
    ctx.setRegister('blockMode', BlockMode.OUTPUT)

    // render the layout file use stored blocks
    ctx.push(yield hash.render(ctx))
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
  }
} as TagImplOptions
