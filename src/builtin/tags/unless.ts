import { evalExp, isFalsy } from 'src/render/syntax'
import TagToken from 'src/parser/tag-token'
import Token from 'src/parser/token'
import Scope from 'src/scope/scope'
import ITagImplOptions from 'src/template/tag/itag-impl-options'
import ParseStream from 'src/parser/parse-stream'

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    this.templates = []
    this.elseTemplates = []
    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        p = this.templates
        this.cond = tagToken.args
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endunless', () => stream.stop())
      .on('template', tpl => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: function (scope: Scope) {
    const cond = evalExp(this.cond, scope)
    return isFalsy(cond)
      ? this.liquid.renderer.renderTemplates(this.templates, scope)
      : this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
} as ITagImplOptions
