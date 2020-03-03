import BlockMode from '../../context/block-mode'
import { ParseStream, TagToken, Token, Template, Context, TagImplOptions, Emitter } from '../../types'

export default {
  parse: function (token: TagToken, remainTokens: Token[]) {
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''
    this.tpls = [] as Template[]
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:endblock', () => stream.stop())
      .on('template', (tpl: Template) => this.tpls.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`)
      })
    stream.start()
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const blocks = ctx.getRegister('blocks')
    const childDefined = blocks[this.block]
    const r = this.liquid.renderer
    const html = childDefined !== undefined
      ? childDefined
      : yield r.renderTemplates(this.tpls, ctx)

    if (ctx.getRegister('blockMode', BlockMode.OUTPUT) === BlockMode.STORE) {
      blocks[this.block] = html
      return
    }
    emitter.write(html)
  }
} as TagImplOptions
