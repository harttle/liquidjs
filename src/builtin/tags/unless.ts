import { evalExp, isFalsy } from '../../render/syntax'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Scope from '../../scope/scope'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'

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
