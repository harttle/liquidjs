import { assert, evalQuotedToken, TypeGuards, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'
import BlockMode from '../../context/block-mode'

export default {
  parse: function (token: TagToken) {
    const args = token.args
    const tokenizer = new Tokenizer(args, this.liquid.options.operatorsTrie)
    this.file = this.liquid.options.dynamicPartials
      ? tokenizer.readValue()
      : tokenizer.readFileName()
    assert(this.file, () => `illegal argument "${token.args}"`)

    const begin = tokenizer.p
    const withStr = tokenizer.readIdentifier()
    if (withStr.content === 'with') {
      tokenizer.skipBlank()
      if (tokenizer.peek() !== ':') {
        this.withVar = tokenizer.readValue()
      } else tokenizer.p = begin
    } else tokenizer.p = begin

    this.hash = new Hash(tokenizer.remaining())
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash, withVar, file } = this
    const { renderer } = liquid
    // TODO try move all liquid.parse calls into parse() section
    const filepath = ctx.opts.dynamicPartials
      ? (TypeGuards.isQuotedToken(file)
        ? yield renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)
        : yield evalToken(file, ctx))
      : file.getText()
    assert(filepath, () => `illegal filename "${file.getText()}":"${filepath}"`)

    const saved = ctx.saveRegister('blocks', 'blockMode')
    ctx.setRegister('blocks', {})
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const scope = yield hash.render(ctx)
    if (withVar) scope[filepath] = evalToken(withVar, ctx)
    const templates = yield liquid._parseFile(filepath, ctx.opts, ctx.sync)
    ctx.push(scope)
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
    ctx.restoreRegister(saved)
  }
} as TagImplOptions
