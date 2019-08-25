import { Emitter, evalExp, isFalsy, ParseStream, Context, ITagImplOptions, Token, Hash, TagToken } from '../../types'

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

  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    const cond = await evalExp(this.cond, ctx)
    isFalsy(cond)
      ? await this.liquid.renderer.renderTemplates(this.templates, ctx, emitter)
      : await this.liquid.renderer.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as ITagImplOptions
