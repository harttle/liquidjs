import assert from '../../util/assert'
import { identifier } from '../../parser/lexical'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Context from '../../context/context'
import ITagImplOptions from '../../template/tag/itag-impl-options'

const re = new RegExp(`(${identifier.source})`)

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    const match = tagToken.args.match(re) as RegExpMatchArray
    assert(match, `${tagToken.args} not valid identifier`)

    this.variable = match[1]
    this.templates = []

    const stream = this.liquid.parser.parseStream(remainTokens)
    stream.on('tag:endcapture', () => stream.stop())
      .on('template', (tpl) => this.templates.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })
    stream.start()
  },
  render: async function (ctx: Context) {
    const html = await this.liquid.renderer.renderTemplates(this.templates, ctx)
    ctx.front()[this.variable] = html
  }
} as ITagImplOptions
