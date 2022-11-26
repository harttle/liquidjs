import { Tokenizer, assert, TopLevelToken, Liquid, ValueToken, evalToken, Emitter, TagToken, Context, Tag } from '..'

export default class extends Tag {
  private candidates: ValueToken[] = []
  private group?: ValueToken
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    const tokenizer = new Tokenizer(tagToken.args, this.liquid.options.operators)
    const group = tokenizer.readValue()
    tokenizer.skipBlank()

    if (group) {
      if (tokenizer.peek() === ':') {
        this.group = group
        tokenizer.advance()
      } else this.candidates.push(group)
    }

    while (!tokenizer.end()) {
      const value = tokenizer.readValue()
      if (value) this.candidates.push(value)
      tokenizer.readTo(',')
    }
    assert(this.candidates.length, () => `empty candidates: ${tagToken.getText()}`)
  }

  * render (ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown> {
    const group = (yield evalToken(this.group, ctx)) as ValueToken
    const fingerprint = `cycle:${group}:` + this.candidates.join(',')
    const groups = ctx.getRegister('cycle')
    let idx = groups[fingerprint]

    if (idx === undefined) {
      idx = groups[fingerprint] = 0
    }

    const candidate = this.candidates[idx]
    idx = (idx + 1) % this.candidates.length
    groups[fingerprint] = idx
    return yield evalToken(candidate, ctx)
  }
}
