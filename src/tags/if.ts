import { Liquid, Tag, Value, Emitter, isTruthy, TagToken, TopLevelToken, Context, Template } from '..'

export default class extends Tag {
  branches: { value: Value, templates: Template[] }[] = []
  elseTemplates: Template[] = []

  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    let p
    liquid.parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        value: new Value(tagToken.args, this.liquid),
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => this.branches.push({
        value: new Value(token.args, this.liquid),
        templates: (p = [])
      }))
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endif', function () { this.stop() })
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
      .start()
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, string> {
    const r = this.liquid.renderer

    for (const { value, templates } of this.branches) {
      const v = yield value.value(ctx, ctx.opts.lenientIf)
      if (isTruthy(v, ctx)) {
        yield r.renderTemplates(templates, ctx, emitter)
        return
      }
    }
    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
}
