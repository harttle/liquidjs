import { Value, Emitter, isTruthy, TagToken, TopLevelToken, Context, Template, TagImplOptions } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.branches = []
    this.elseTemplates = []

    let p
    this.liquid.parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        predicate: new Value(tagToken.args, this.liquid),
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => this.branches.push({
        predicate: new Value(token.args, this.liquid),
        templates: (p = [])
      }))
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endif', function () { this.stop() })
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
      .start()
  },

  render: function * (ctx: Context, emitter: Emitter): Generator<unknown, void, string> {
    const r = this.liquid.renderer

    for (const { predicate, templates } of this.branches) {
      const value = yield predicate.value(ctx, ctx.opts.lenientIf)
      if (isTruthy(value, ctx)) {
        yield r.renderTemplates(templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
} as TagImplOptions
