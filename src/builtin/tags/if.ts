import { evalExp, isTruthy } from '../../render/syntax'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Scope from '../../scope/scope'
import ITemplate from '../../template/itemplate'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'

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

  render: async function (scope: Scope) {
    for (const branch of this.branches) {
      const cond = await evalExp(branch.cond, scope)
      if (isTruthy(cond)) {
        return this.liquid.renderer.renderTemplates(branch.templates, scope)
      }
    }
    return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
} as ITagImplOptions
