import { Scope, Template, Liquid, Tag, assert, Emitter, Hash, TagToken, TopLevelToken, Context } from '..'
import { BlockMode } from '../context'
import { parseFilePath, renderFilePath, ParsedFileName } from './render'
import { BlankDrop } from '../drop'
import { Parser } from '../parser'
import { Arguments } from '../template'
import { isValueToken } from '../util'

export default class extends Tag {
  args: Hash
  templates: Template[]
  file?: ParsedFileName
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(token, remainTokens, liquid)
    this.file = parseFilePath(this.tokenizer, this.liquid, parser)
    this['currentFile'] = token.file
    this.args = new Hash(this.tokenizer.remaining(), liquid.options.keyValueSeparator)
    this.templates = parser.parseTokens(remainTokens)
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown> {
    const { liquid, args, file } = this
    const { renderer } = liquid
    if (file === undefined) {
      ctx.setRegister('blockMode', BlockMode.OUTPUT)
      yield renderer.renderTemplates(this.templates, ctx, emitter)
      return
    }
    const filepath = (yield renderFilePath(this.file, ctx, liquid)) as string
    assert(filepath, () => `illegal file path "${filepath}"`)
    const templates = (yield liquid._parseLayoutFile(filepath, ctx.sync, this['currentFile'])) as Template[]

    // render remaining contents and store rendered results
    ctx.setRegister('blockMode', BlockMode.STORE)
    const html = yield renderer.renderTemplates(this.templates, ctx)
    const blocks = ctx.getRegister('blocks')

    // set whole content to anonymous block if anonymous doesn't specified
    if (blocks[''] === undefined) blocks[''] = (parent: BlankDrop, emitter: Emitter) => emitter.write(html)
    ctx.setRegister('blockMode', BlockMode.OUTPUT)

    // render the layout file use stored blocks
    ctx.push((yield args.render(ctx)) as Scope)
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop()
  }

  public * arguments (): Arguments {
    for (const v of Object.values(this.args.hash)) {
      if (isValueToken(v)) {
        yield v
      }
    }

    if (isValueToken(this['file'])) {
      yield this['file']
    }
  }

  public * blockScope (): Iterable<string> {
    for (const k of Object.keys(this.args.hash)) {
      yield k
    }
  }
}
