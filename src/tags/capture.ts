import { Liquid, Tag, Template, Context, TagToken, TopLevelToken } from '..'
import { evalQuotedToken } from '../render'
import { isTagToken } from '../util'

export default class extends Tag {
  variable: string
  templates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    this.variable = this.readVariableName()

    while (remainTokens.length) {
      const token = remainTokens.shift()!
      if (isTagToken(token) && token.name === 'endcapture') return
      this.templates.push(liquid.parser.parseToken(token, remainTokens))
    }
    throw new Error(`tag ${tagToken.getText()} not closed`)
  }
  * render (ctx: Context): Generator<unknown, void, string> {
    const r = this.liquid.renderer
    const html = yield r.renderTemplates(this.templates, ctx)
    ctx.bottom()[this.variable] = html
  }
  private readVariableName () {
    const word = this.tokenizer.readIdentifier().content
    if (word) return word
    const quoted = this.tokenizer.readQuoted()
    if (quoted) return evalQuotedToken(quoted)
    throw this.tokenizer.error('invalid capture name')
  }
}
