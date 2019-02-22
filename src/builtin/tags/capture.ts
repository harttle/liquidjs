import assert from 'src/util/assert'
import { identifier } from 'src/parser/lexical'
import { CaptureScope } from 'src/scope/scopes'
import TagToken from 'src/parser/tag-token'
import Token from 'src/parser/token'
import Scope from 'src/scope/scope'
import ITagImplOptions from 'src/template/tag/itag-impl-options';

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
  render: async function (scope: Scope) {
    const html = await this.liquid.renderer.renderTemplates(this.templates, scope)
    const ctx = new CaptureScope()
    ctx[this.variable] = html
    scope.push(ctx)
  }
} as ITagImplOptions
