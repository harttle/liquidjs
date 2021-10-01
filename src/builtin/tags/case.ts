import { toValue, evalToken, Value, Emitter, TagToken, TopLevelToken, Context, Template, TagImplOptions, ParseStream } from '../../types'
import { Tokenizer } from '../../parser/tokenizer'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.cond = new Value(tagToken.args, this.liquid)
    this.cases = []
    this.elseTemplates = []

    let p: Template[] = []
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        p = []

        const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)

        while (!tokenizer.end()) {
          const value = tokenizer.readValue()
          this.cases.push({
            val: value,
            templates: p
          })
          tokenizer.readTo(',')
        }
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = toValue(yield this.cond.value(ctx, ctx.opts.lenientIf))
    for (const branch of this.cases) {
      const val = evalToken(branch.val, ctx, ctx.opts.lenientIf)
      if (val === cond) {
        yield r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as TagImplOptions
