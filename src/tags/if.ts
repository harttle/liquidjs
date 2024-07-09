import { Liquid, Tag, Value, Emitter, isTruthy, TagToken, TopLevelToken, Context, Template } from '..'
import { Parser } from '../parser'
import { assert, assertEmpty } from '../util'

export default class extends Tag {
  branches: { value: Value, templates: Template[] }[] = []
  elseTemplates: Template[] | undefined

  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(tagToken, remainTokens, liquid)
    let p: Template[] = []
    parser.parseStream(remainTokens)
      .on('start', () => this.branches.push({
        value: new Value(tagToken.args, this.liquid),
        templates: (p = [])
      }))
      .on('tag:elsif', (token: TagToken) => {
        assert(!this.elseTemplates, 'unexpected elsif after else')
        this.branches.push({
          value: new Value(token.args, this.liquid),
          templates: (p = [])
        })
      })
      .on<TagToken>('tag:else', tag => {
      assertEmpty(tag.args)
      assert(!this.elseTemplates, 'duplicated else')
      p = this.elseTemplates = []
    })
      .on<TagToken>('tag:endif', function (tag) { assertEmpty(tag.args); this.stop() })
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
    yield r.renderTemplates(this.elseTemplates || [], ctx, emitter)
  }
}
