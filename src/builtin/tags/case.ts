import { evalExp } from 'src/render/syntax'
import TagToken from 'src/parser/tag-token'
import Token from 'src/parser/token'
import Scope from 'src/scope/scope'
import ITemplate from 'src/template/itemplate'
import ITagImplOptions from 'src/template/tag/itag-impl-options'
import ParseStream from 'src/parser/parse-stream'

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    this.cond = tagToken.args
    this.cases = []
    this.elseTemplates = []

    let p: ITemplate[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        this.cases.push({
          val: token.args,
          templates: p = []
        })
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: ITemplate) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: function (scope: Scope) {
    for (let i = 0; i < this.cases.length; i++) {
      const branch = this.cases[i]
      const val = evalExp(branch.val, scope)
      const cond = evalExp(this.cond, scope)
      if (val === cond) {
        return this.liquid.renderer.renderTemplates(branch.templates, scope)
      }
    }
    return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
} as ITagImplOptions
