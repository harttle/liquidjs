import { Liquid, Tag, Value, TopLevelToken, Template, Emitter, isTruthy, isFalsy, Context, TagToken } from '..'

export default class extends Tag {
  branches: { value: Value, test: (val: any, ctx: Context) => boolean, templates: Template[] }[] = []
  elseTemplates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    let p: Template[] = []
    let elseCount = 0
    this.liquid.parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        value: new Value(tagToken.args, this.liquid),
        test: isFalsy,
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => {
        if (elseCount > 0) {
          p = []
          return
        }
        this.branches.push({
          value: new Value(token.args, this.liquid),
          test: isTruthy,
          templates: (p = [])
        })
      })
      .on('tag:else', () => {
        elseCount++
        p = this.elseTemplates
      })
      .on('tag:endunless', function () { this.stop() })
      .on('template', (tpl: Template) => {
        if (p !== this.elseTemplates || elseCount === 1) {
          p.push(tpl)
        }
      })
      .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
      .start()
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown> {
    const r = this.liquid.renderer

    for (const { value, test, templates } of this.branches) {
      const v = yield value.value(ctx, ctx.opts.lenientIf)
      if (test(v, ctx)) {
        yield r.renderTemplates(templates, ctx, emitter)
        return
      }
    }

    yield r.renderTemplates(this.elseTemplates, ctx, emitter)
  }
}
