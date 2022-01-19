import { assert, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'
import { parseFilePath, renderFilePath } from './render'

export default {
  parseFilePath,
  renderFilePath,
  parse: function (token: TagToken) {
    const args = token.args
    const tokenizer = new Tokenizer(args, this.liquid.options.operatorsTrie)
    this['file'] = this.parseFilePath(tokenizer, this.liquid)
    this['currentFile'] = token.file

    const begin = tokenizer.p
    const withStr = tokenizer.readIdentifier()
    if (withStr.content === 'with') {
      tokenizer.skipBlank()
      if (tokenizer.peek() !== ':') {
        this.withVar = tokenizer.readValue()
      } else tokenizer.p = begin
    } else tokenizer.p = begin

    this.hash = new Hash(tokenizer.remaining(), this.liquid.options.jekyllInclude)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, withVar } = this
    const { renderer } = liquid
    const filepath = yield this.renderFilePath(this['file'], ctx, liquid)
    assert(filepath, () => `illegal filename "${filepath}"`)

    const saved = ctx.saveRegister('blocks', 'blockMode')
    ctx.setRegister('blocks', {})
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const scope = yield hash.render(ctx)
    if (withVar) scope[filepath] = evalToken(withVar, ctx)
    const templates = yield liquid._parsePartialFile(filepath, ctx.sync, this['currentFile'])
    ctx.push(ctx.opts.jekyllInclude ? { include: scope } : scope)
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
    ctx.restoreRegister(saved)
  }
} as TagImplOptions
