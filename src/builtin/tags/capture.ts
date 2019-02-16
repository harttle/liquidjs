import assert from 'src/util/assert'
import { identifier } from 'src/parser/lexical'
import { CaptureScope } from 'src/scope/scopes'

const re = new RegExp(`(${identifier.source})`)

export default {
  parse: function (tagToken, remainTokens) {
    const match = tagToken.args.match(re)
    assert(match, `${tagToken.args} not valid identifier`)

    this.variable = match[1]
    this.templates = []

    const stream = this.liquid.parser.parseStream(remainTokens)
    stream.on('tag:endcapture', token => stream.stop())
      .on('template', tpl => this.templates.push(tpl))
      .on('end', x => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })
    stream.start()
  },
  render: async function (scope, hash) {
    const html = await this.liquid.renderer.renderTemplates(this.templates, scope)
    const ctx = new CaptureScope()
    ctx[this.variable] = html
    scope.push(ctx)
  }
}
