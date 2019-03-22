import { evalExp, isFalsy } from '../../render/syntax'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Context from '../../context/context'
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

  render: async function (ctx: Context) {
    const cond = await evalExp(this.cond, ctx)
    return isFalsy(cond)
      ? this.liquid.renderer.renderTemplates(this.templates, ctx)
      : this.liquid.renderer.renderTemplates(this.elseTemplates, ctx)
  }
} as ITagImplOptions
