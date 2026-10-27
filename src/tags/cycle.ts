import { TopLevelToken, Liquid, ValueToken, evalToken, Emitter, TagToken, Context, Tag, Value } from '..'
import { Arguments } from '../template'
import { toValue } from '../util'

export default class extends Tag {
  private candidates: Value[] = []
  private candidateTexts: string[] = []
  private group?: ValueToken
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const begin = this.tokenizer.p
    const group = this.tokenizer.readValue()
    this.tokenizer.skipBlank()

    if (group) {
      if (this.tokenizer.peek() === ':') {
        this.group = group
        this.tokenizer.advance()
      } else this.tokenizer.p = begin
    }

    while (!this.tokenizer.end()) {
      const value = this.tokenizer.readFilteredValue()
      this.candidates.push(new Value(value, this.liquid))
      this.candidateTexts.push(value.getText())
      this.tokenizer.readTo(',')
    }
    this.tokenizer.assert(this.candidates.length, () => `empty candidates: "${token.getText()}"`)
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown> {
    const group = (yield evalToken(this.group, ctx)) as ValueToken
    const fingerprint = `cycle:${group}:` + this.candidateTexts.join(',')
    const groups = ctx.getRegister('cycle', {} as Record<string, number>)
    let idx = groups[fingerprint]

    if (idx === undefined) {
      idx = groups[fingerprint] = 0
    }

    const candidate = this.candidates[idx]
    idx = (idx + 1) % this.candidates.length
    groups[fingerprint] = idx
    let val = yield toValue(yield candidate.value(ctx, false))
    const outputEscape = this.liquid.options.outputEscape
    if (outputEscape && !candidate.filters[candidate.filters.length - 1]?.raw) {
      val = yield outputEscape.call({ context: ctx, token: this.token, liquid: this.liquid }, val)
    }
    return val
  }

  public * arguments (): Arguments {
    yield * this.candidates

    if (this.group) {
      yield this.group
    }
  }
}
