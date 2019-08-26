import { Emitter, Expression, isFalsy, ParseStream, Context, ITagImplOptions, Token, Hash, TagToken } from '../../types'

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

  renderSync: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = new Expression(this.cond).valueSync(ctx)
    isFalsy(cond)
      ? r.renderTemplatesSync(this.templates, ctx, emitter)
      : r.renderTemplatesSync(this.elseTemplates, ctx, emitter)
  },

  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = await new Expression(this.cond).value(ctx)
    await isFalsy(cond)
      ? r.renderTemplates(this.templates, ctx, emitter)
      : r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as ITagImplOptions
