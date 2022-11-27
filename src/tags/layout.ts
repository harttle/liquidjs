import { Scope, Template, Liquid, Tag, assert, Tokenizer, Emitter, Hash, TagToken, TopLevelToken, Context } from '..'
import { BlockMode } from '../context'
import { parseFilePath, renderFilePath, ParsedFileName } from './render'
import { BlankDrop } from '../drop'

export default class extends Tag {
  args: Hash
  templates: Template[]
  file?: ParsedFileName
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operators)
    this.file = parseFilePath(tokenizer, this.liquid)
    this['currentFile'] = token.file
    this.args = new Hash(tokenizer.remaining())
    this.templates = this.liquid.parser.parseTokens(remainTokens)
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
    assert(filepath, () => `illegal filename "${filepath}"`)
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
}
