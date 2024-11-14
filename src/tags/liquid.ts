import { Template, Emitter, Liquid, TopLevelToken, TagToken, Context, Tag } from '..'
import { Parser } from '../parser'
import { StaticNode } from '../template'

export default class extends Tag {
  templates: Template[]
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(token, remainTokens, liquid)
    const tokens = this.tokenizer.readLiquidTagTokens(this.liquid.options)
    this.templates = parser.parseTokens(tokens)
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter)
  }

  public node (): StaticNode {
    return {
      token: this.token,
      values: [],
      children: this.templates,
      blockScope: [],
      templateScope: []
    }
  }
}
