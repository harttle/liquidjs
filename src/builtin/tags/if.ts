import { Hash, Emitter, isTruthy, Expression, TagToken, Token, Context, ITemplate, ITagImplOptions, ParseStream } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    this.branches = []
    this.elseTemplates = []

    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        cond: tagToken.args,
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => {
        this.branches.push({
          cond: token.args,
          templates: p = []
        })
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endif', () => stream.stop())
      .on('template', (tpl: ITemplate) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer

    for (const branch of this.branches) {
      const cond = await new Expression(branch.cond).value(ctx)
      if (isTruthy(cond)) {
        await r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    await r.renderTemplates(this.elseTemplates, ctx, emitter)
  },

  renderSync: function (ctx: Context, hash: Hash, emitter: Emitter) {
    const r = this.liquid.renderer

    for (const branch of this.branches) {
      const cond = new Expression(branch.cond).valueSync(ctx)
      if (isTruthy(cond)) {
        r.renderTemplatesSync(branch.templates, ctx, emitter)
        return
      }
    }
    r.renderTemplatesSync(this.elseTemplates, ctx, emitter)
  }
} as ITagImplOptions
