import { evalExp } from '../../render/syntax'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Context from '../../context/context'
import ITemplate from '../../template/itemplate'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'

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

  render: async function (ctx: Context) {
    for (let i = 0; i < this.cases.length; i++) {
      const branch = this.cases[i]
      const val = await evalExp(branch.val, ctx)
      const cond = await evalExp(this.cond, ctx)
      if (val === cond) {
        return this.liquid.renderer.renderTemplates(branch.templates, ctx)
      }
    }
    return this.liquid.renderer.renderTemplates(this.elseTemplates, ctx)
  }
} as ITagImplOptions
