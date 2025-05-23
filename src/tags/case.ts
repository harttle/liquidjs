import { ValueToken, Liquid, toValue, evalToken, Value, Emitter, TagToken, TopLevelToken, Context, Template, Tag, ParseStream } from '..'
import { Parser } from '../parser'
import { equals } from '../render'
import { Arguments } from '../template'

export default class extends Tag {
  value: Value
  branches: { values: ValueToken[], templates: Template[] }[] = []
  elseTemplates: Template[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(tagToken, remainTokens, liquid)
    this.value = new Value(this.tokenizer.readFilteredValue(), this.liquid)
    this.elseTemplates = []

    let p: Template[] = []
    let elseCount = 0
    const stream: ParseStream = parser.parseStream(remainTokens)
      .on('tag:when', (token: TagToken) => {
        if (elseCount > 0) {
          return
        }

        p = []

        const values: ValueToken[] = []
        while (!token.tokenizer.end()) {
          values.push(token.tokenizer.readValueOrThrow())
          token.tokenizer.skipBlank()
          if (token.tokenizer.peek() === ',') {
            token.tokenizer.readTo(',')
          } else {
            token.tokenizer.readTo('or')
          }
        }
        this.branches.push({
          values,
          templates: p
        })
      })
      .on('tag:else', () => {
        elseCount++
        p = this.elseTemplates
      })
      .on('tag:endcase', () => stream.stop())
      .on('template', (tpl: Template) => {
        if (p !== this.elseTemplates || elseCount === 1) {
          p.push(tpl)
        }
      })
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })

    stream.start()
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const r = this.liquid.renderer
    const target = toValue(yield this.value.value(ctx, ctx.opts.lenientIf))
    let branchHit = false
    for (const branch of this.branches) {
      for (const valueToken of branch.values) {
        const value = yield evalToken(valueToken, ctx, ctx.opts.lenientIf)
        if (equals(target, value)) {
          yield r.renderTemplates(branch.templates, ctx, emitter)
          branchHit = true
          break
        }
      }
    }
    if (!branchHit) {
      yield r.renderTemplates(this.elseTemplates, ctx, emitter)
    }
  }

  public * arguments (): Arguments {
    yield this.value
    yield * this.branches.flatMap(b => b.values)
  }

  public * children (): Generator<unknown, Template[]> {
    const templates = this.branches.flatMap(b => b.templates)
    if (this.elseTemplates) {
      templates.push(...this.elseTemplates)
    }
    return templates
  }
}
