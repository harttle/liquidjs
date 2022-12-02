import { ValueToken, Liquid, Tokenizer, toValue, evalToken, Value, Emitter, TagToken, TopLevelToken, Context, Template, Tag, ParseStream } from '..'

export default class extends Tag {
  value: Value
  branches: { values: ValueToken[], templates: Template[] }[] = []
  elseTemplates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    this.value = new Value(tagToken.args, this.liquid)
    this.elseTemplates = []

    let p: Template[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        p = []

        const tokenizer = new Tokenizer(token.args, this.liquid.options.operators)
        const values: ValueToken[] = []
        while (!tokenizer.end()) {
          values.push(tokenizer.readValueOrThrow())
          tokenizer.readTo(',')
        }
        this.branches.push({
          values,
          templates: p
        })
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const r = this.liquid.renderer
    const target = toValue(yield this.value.value(ctx, ctx.opts.lenientIf))
    let branchHit = false
    for (const branch of this.branches) {
      for (const valueToken of branch.values) {
        const value = yield evalToken(valueToken, ctx, ctx.opts.lenientIf)
        if (target === value) {
          yield r.renderTemplates(branch.templates, ctx, emitter)
          branchHit = true
          break
        }
      }
    }
    if (!branchHit) {
      yield r.renderTemplates(this.elseTemplates, ctx, emitter)
    }
  }
}
