import { ValueToken, Liquid, Tokenizer, toValue, evalToken, Value, Emitter, TagToken, TopLevelToken, Context, Template, Tag, ParseStream } from '..'

export default class extends Tag {
  private cond: Value
  private cases: { val?: ValueToken, templates: Template[] }[] = []
  private elseTemplates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    this.cond = new Value(tagToken.args, this.liquid)
    this.elseTemplates = []

    let p: Template[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        p = []

        const tokenizer = new Tokenizer(token.args, this.liquid.options.operators)

        while (!tokenizer.end()) {
          const value = tokenizer.readValue()
          this.cases.push({
            val: value,
            templates: p
          })
          tokenizer.readTo(',')
        }
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown> {
    const r = this.liquid.renderer
    const cond = toValue(yield this.cond.value(ctx, ctx.opts.lenientIf))
    for (const branch of this.cases) {
      const val = yield evalToken(branch.val, ctx, ctx.opts.lenientIf)
      if (val === cond) {
        yield r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
}
