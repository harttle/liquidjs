import { Emitter, Expression, isFalsy, ParseStream, Context, TagImplOptions, Token, Hash, TagToken } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
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
      .on('template', tpl => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = yield new Expression(this.cond).value(ctx)
    yield (isFalsy(cond)
      ? r.renderTemplates(this.templates, ctx, emitter)
      : r.renderTemplates(this.elseTemplates, ctx, emitter))
  }
} as TagImplOptions
