import { Expression, Emitter, TagToken, TopLevelToken, Context, Template, TagImplOptions, ParseStream } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.cond = tagToken.args
    this.cases = []
    this.elseTemplates = []

    let p: Template[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        this.cases.push({
          val: token.args,
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
    const cond = yield new Expression(this.cond, this.liquid.options.operators).value(ctx)
    for (let i = 0; i < this.cases.length; i++) {
      const branch = this.cases[i]
      const val = yield new Expression(branch.val, this.liquid.options.operators).value(ctx)
      if (val === cond) {
        yield r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as TagImplOptions
