import { evalExp, isTruthy } from 'src/render/syntax'
import TagToken from 'src/parser/tag-token';
import Token from 'src/parser/token';
import Scope from 'src/scope/scope';
import ITemplate from 'src/template/itemplate';
import ITagImplOptions from 'src/template/tag/itag-impl-options';
import ParseStream from 'src/parser/parse-stream';

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

  render: function (scope: Scope) {
    for (const branch of this.branches) {
      const cond = evalExp(branch.cond, scope)
      if (isTruthy(cond)) {
        return this.liquid.renderer.renderTemplates(branch.templates, scope)
      }
    }
    return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
} as ITagImplOptions
