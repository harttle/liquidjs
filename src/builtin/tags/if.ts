import { Emitter, isTruthy, Expression, TagToken, TopLevelToken, Context, Template, TagImplOptions, ParseStream } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
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
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer

    for (const branch of this.branches) {
      const cond = yield new Expression(branch.cond).value(ctx)
      if (isTruthy(cond, ctx)) {
        yield r.renderTemplates(branch.templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as TagImplOptions
