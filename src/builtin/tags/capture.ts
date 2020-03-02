import { assert } from '../../util/assert'
import { identifier } from '../../parser/lexical'
import { Template, Context, TagImplOptions, TagToken, Token } from '../../types'

const re = new RegExp(`(${identifier.source})`)

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    const match = tagToken.args.match(re) as RegExpMatchArray
    assert(match, `${tagToken.args} not valid identifier`)

    this.variable = match[1]
    this.templates = []

    const stream = this.liquid.parser.parseStream(remainTokens)
    stream.on('tag:endcapture', () => stream.stop())
      .on('template', (tpl: Template) => this.templates.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })
    stream.start()
  },
  render: function * (ctx: Context) {
    const r = this.liquid.renderer
    const html = yield r.renderTemplates(this.templates, ctx)
    ctx.front()[this.variable] = html
  }
} as TagImplOptions
