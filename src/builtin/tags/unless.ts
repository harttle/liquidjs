import { Value, TopLevelToken, Template, Emitter, isTruthy, isFalsy, ParseStream, Context, TagImplOptions, TagToken } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.templates = []
    this.branches = []
    this.elseTemplates = []
    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        p = this.templates
        this.cond = new Value(tagToken.args, this.liquid)
      })
      .on('tag:elsif', (token: TagToken) => {
        this.branches.push({
          cond: new Value(token.args, this.liquid),
          templates: p = []
        })
      })
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endunless', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer
    const cond = yield this.cond.value(ctx, ctx.opts.lenientIf)

    if (isFalsy(cond, ctx)) {
      yield r.renderTemplates(this.templates, ctx, emitter)
      return
    }

    for (const branch of this.branches) {
      const cond = yield branch.cond.value(ctx, ctx.opts.lenientIf)
      if (isTruthy(cond, ctx)) {
        yield r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }

    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as TagImplOptions
