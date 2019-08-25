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
    for (const branch of this.branches) {
      const cond = new Expression(branch.cond).value(ctx)
      if (isTruthy(cond)) {
        await this.liquid.renderer.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    await this.liquid.renderer.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as ITagImplOptions
