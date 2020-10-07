import { TopLevelToken, Template, Emitter, Expression, isFalsy, ParseStream, Context, TagImplOptions, Token, TagToken } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.templates = []
    this.elseTemplates = []
    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        p = this.templates
        this.cond = tagToken.args
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endunless', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = yield new Expression(this.cond).value(ctx)
    yield (isFalsy(cond, ctx)
      ? r.renderTemplates(this.templates, ctx, emitter)
      : r.renderTemplates(this.elseTemplates, ctx, emitter))
  }
} as TagImplOptions
