import { Tokenizer, assert, Template, Context, TagImplOptions, TagToken, TopLevelToken } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    const tokenizer = new Tokenizer(tagToken.args)
    this.variable = tokenizer.readWord().content
    assert(this.variable, () => `${tagToken.args} not valid identifier`)

    this.templates = []

    const stream = this.liquid.parser.parseStream(remainTokens)
    stream.on('tag:endcapture', () => stream.stop())
      .on('template', (tpl: Template) => this.templates.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })
    stream.start()
  },
  render: function * (ctx: Context) {
    const r = this.liquid.renderer
    const html = yield r.renderTemplates(this.templates, ctx)
    ctx.bottom()[this.variable] = html
  }
} as TagImplOptions
