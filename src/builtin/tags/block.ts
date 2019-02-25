import BlockMode from '../../scope/block-mode'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import ITemplate from '../../template/itemplate'
import Scope from '../../scope/scope'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'

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
