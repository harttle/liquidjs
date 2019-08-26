import { Expression, Hash, Emitter, TagToken, Token, Context, ITemplate, ITagImplOptions, ParseStream } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    this.cond = tagToken.args
    this.cases = []
    this.elseTemplates = []

    let p: ITemplate[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        this.cases.push({
          val: token.args,
          templates: p = []
        })
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: ITemplate) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer
    for (let i = 0; i < this.cases.length; i++) {
      const branch = this.cases[i]
      const val = await new Expression(branch.val).value(ctx)
      const cond = await new Expression(this.cond).value(ctx)
      if (val === cond) {
        await r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    await r.renderTemplates(this.elseTemplates, ctx, emitter)
  },

  renderSync: function (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer
    for (let i = 0; i < this.cases.length; i++) {
      const branch = this.cases[i]
      const val = new Expression(branch.val).valueSync(ctx)
      const cond = new Expression(this.cond).valueSync(ctx)
      if (val === cond) {
        r.renderTemplatesSync(branch.templates, ctx, emitter)
        return
      }
    }
    r.renderTemplatesSync(this.elseTemplates, ctx, emitter)
  }
} as ITagImplOptions
