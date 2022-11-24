import { Liquid, Tag, Value, TopLevelToken, Template, Emitter, isTruthy, isFalsy, Context, TagToken } from '..'

export default class extends Tag {
  private branches: { predicate: Value, test: (val: any, ctx: Context) => boolean, templates: Template[] }[] = []
  private elseTemplates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    let p
    this.liquid.parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        predicate: new Value(tagToken.args, this.liquid),
        test: isFalsy,
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => this.branches.push({
        predicate: new Value(token.args, this.liquid),
        test: isTruthy,
        templates: (p = [])
      }))
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endunless', function () { this.stop() })
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
      .start()
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown> {
    const r = this.liquid.renderer

    for (const { predicate, test, templates } of this.branches) {
      const value = yield predicate.value(ctx, ctx.opts.lenientIf)
      if (test(value, ctx)) {
        yield r.renderTemplates(templates, ctx, emitter)
        return
      }
    }

    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
}
