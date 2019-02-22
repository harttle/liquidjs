import BlockMode from 'src/scope/block-mode'
import TagToken from 'src/parser/tag-token'
import Token from 'src/parser/token'
import ITemplate from 'src/template/itemplate'
import Scope from 'src/scope/scope'
import ITagImplOptions from 'src/template/tag/itag-impl-options'
import ParseStream from 'src/parser/parse-stream'

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
  render: async function (scope: Scope) {
    const childDefined = scope.blocks[this.block]
    const html = childDefined !== undefined
      ? childDefined
      : await this.liquid.renderer.renderTemplates(this.tpls, scope)

    if (scope.blockMode === BlockMode.STORE) {
      scope.blocks[this.block] = html
      return ''
    }
    return html
  }
} as ITagImplOptions
