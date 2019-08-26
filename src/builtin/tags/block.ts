import BlockMode from '../../context/block-mode'
import { ParseStream, TagToken, Token, ITemplate, Context, ITagImplOptions, Emitter, Hash } from '../../types'

export default {
  parse: function (token: TagToken, remainTokens: Token[]) {
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''
    this.tpls = [] as ITemplate[]
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:endblock', () => stream.stop())
      .on('template', (tpl: ITemplate) => this.tpls.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`)
      })
    stream.start()
  },
  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    const blocks = ctx.getRegister('blocks')
    const childDefined = blocks[this.block]
    const r = this.liquid.renderer
    const html = childDefined !== undefined
      ? childDefined
      : (ctx.sync
        ? r.renderTemplatesSync(this.tpls, ctx)
        : await r.renderTemplates(this.tpls, ctx)
      )

    if (ctx.getRegister('blockMode', BlockMode.OUTPUT) === BlockMode.STORE) {
      blocks[this.block] = html
      return
    }
    emitter.write(html)
  }
} as ITagImplOptions
