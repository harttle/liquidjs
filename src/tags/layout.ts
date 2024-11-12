import { Scope, Template, Liquid, Tag, assert, Emitter, Hash, TagToken, TopLevelToken, Context, Value, ValueToken } from '..'
import { BlockMode } from '../context'
import { parseFilePath, renderFilePath, ParsedFileName } from './render'
import { BlankDrop } from '../drop'
import { Parser } from '../parser'
import { MetaNode } from '../template/node'
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

  public node (): MetaNode {
    const values: Array<Value | ValueToken> = []
    const blockScope: string[] = []

    for (const [k, v] of Object.entries(this.args.hash)) {
      blockScope.push(k)
      if (isValueToken(v)) {
        values.push(v)
      }
    }

    if (isValueToken(this.file)) {
      values.push(this.file)
    }

    return {
      token: this.token,
      values, // Values from this.hash and this.file
      children: [],
      blockScope, // Keys from this.hash and withVar
      templateScope: []
    }
  }
}
