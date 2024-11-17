import { Template, ValueToken, TopLevelToken, Liquid, Tag, assert, evalToken, Hash, Emitter, TagToken, Context } from '..'
import { BlockMode, Scope } from '../context'
import { Parser } from '../parser'
import { Arguments } from '../template'
import { isValueToken } from '../util'
import { parseFilePath, renderFilePath } from './render'

export default class extends Tag {
  private withVar?: ValueToken
  private hash: Hash
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(token, remainTokens, liquid)
    const { tokenizer } = token
    this['file'] = parseFilePath(tokenizer, this.liquid, parser)
    this['currentFile'] = token.file

    const begin = tokenizer.p
    const withStr = tokenizer.readIdentifier()
    if (withStr.content === 'with') {
      tokenizer.skipBlank()
      if (tokenizer.peek() !== ':') {
        this.withVar = tokenizer.readValue()
      } else tokenizer.p = begin
    } else tokenizer.p = begin

    this.hash = new Hash(tokenizer.remaining(), liquid.options.jekyllInclude || liquid.options.keyValueSeparator)
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const { liquid, hash, withVar } = this
    const { renderer } = liquid
    const filepath = (yield renderFilePath(this['file'], ctx, liquid)) as string
    assert(filepath, () => `illegal file path "${filepath}"`)

    const saved = ctx.saveRegister('blocks', 'blockMode')
    ctx.setRegister('blocks', {})
    ctx.setRegister('blockMode', BlockMode.OUTPUT)
    const scope = (yield hash.render(ctx)) as Scope
    if (withVar) scope[filepath] = yield evalToken(withVar, ctx)
    const templates = (yield liquid._parsePartialFile(filepath, ctx.sync, this['currentFile'])) as Template[]
    ctx.push(ctx.opts.jekyllInclude ? { include: scope } : scope)
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
    ctx.restoreRegister(saved)
  }

  public * arguments (): Arguments {
    yield * Object.values(this.hash.hash).filter(isValueToken)

    if (isValueToken(this['file'])) {
      yield this['file']
    }

    if (isValueToken(this.withVar)) {
      yield this.withVar
    }
  }

  public * blockScope (): Iterable<string> {
    for (const k of Object.keys(this.hash.hash)) {
      yield k
    }

    // TODO: withVar
  }
}
