import { toValue, Value, Emitter, TagToken, TopLevelToken, Context, Template, TagImplOptions, ParseStream } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.cond = new Value(tagToken.args, this.liquid)
    this.cases = []
    this.elseTemplates = []

    let p: Template[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        this.cases.push({
          val: new Value(token.args, this.liquid),
          templates: p = []
        })
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = toValue(yield this.cond.value(ctx, ctx.opts.lenientIf))
    for (const branch of this.cases) {
      const val = toValue(yield branch.val.value(ctx, ctx.opts.lenientIf))
      if (val === cond) {
        yield r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as TagImplOptions
