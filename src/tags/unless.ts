import { Liquid, Tag, Value, TopLevelToken, Template, Emitter, isTruthy, isFalsy, Context, TagToken } from '..'
import { Parser } from '../parser'
import { Arguments } from '../template'

export default class extends Tag {
  branches: { value: Value, test: (val: any, ctx: Context) => boolean, templates: Template[] }[] = []
  elseTemplates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(tagToken, remainTokens, liquid)
    let p: Template[] = []
    let elseCount = 0
    parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        value: new Value(tagToken.tokenizer.readFilteredValue(), this.liquid),
        test: isFalsy,
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => {
        if (elseCount > 0) {
          p = []
          return
        }
        this.branches.push({
          value: new Value(token.tokenizer.readFilteredValue(), this.liquid),
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

  public * children (): Generator<unknown, Template[]> {
    const children = this.branches.flatMap(b => b.templates)
    if (this.elseTemplates) {
      children.push(...this.elseTemplates)
    }
    return children
  }

  public arguments (): Arguments {
    return this.branches.map(b => b.value)
  }
}
