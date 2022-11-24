import { Template, Tokenizer, Emitter, Liquid, TopLevelToken, TagToken, Context, Tag } from '..'

export default class extends Tag {
  private tpls: Template[]
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operators)
    const tokens = tokenizer.readLiquidTagTokens(this.liquid.options)
    this.tpls = this.liquid.parser.parseTokens(tokens)
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter)
  }
}
