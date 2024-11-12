import { TopLevelToken, Liquid, ValueToken, evalToken, Emitter, TagToken, Context, Tag } from '..'
import { MetaNode } from '../template/node'

export default class extends Tag {
  private candidates: ValueToken[] = []
  private group?: ValueToken
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const group = this.tokenizer.readValue()
    this.tokenizer.skipBlank()

    if (group) {
      if (this.tokenizer.peek() === ':') {
        this.group = group
        this.tokenizer.advance()
      } else this.candidates.push(group)
    }

    while (!this.tokenizer.end()) {
      const value = this.tokenizer.readValue()
      if (value) this.candidates.push(value)
      this.tokenizer.readTo(',')
    }
    this.tokenizer.assert(this.candidates.length, () => `empty candidates: "${token.getText()}"`)
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

  public node (): MetaNode {
    const values = this.candidates.slice()
    if (this.group) {
      values.push(this.group)
    }

    return {
      token: this.token,
      values,
      children: [],
      blockScope: [],
      templateScope: []
    }
  }
}
