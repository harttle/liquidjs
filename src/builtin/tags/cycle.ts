import { assert } from '../../util/assert'
import { evalToken, Emitter, TagToken, Context, TagImplOptions } from '../../types'
import { Tokenizer } from '../../parser/tokenizer'

export default {
  parse: function (tagToken: TagToken) {
    const tokenizer = new Tokenizer(tagToken.args, this.liquid.options.operatorsTrie)
    const group = tokenizer.readValue()
    tokenizer.skipBlank()

    this.candidates = []

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
  },

  render: function (ctx: Context, emitter: Emitter) {
    const group = evalToken(this.group, ctx)
    const fingerprint = `cycle:${group}:` + this.candidates.join(',')
    const groups = ctx.getRegister('cycle')
    let idx = groups[fingerprint]

    if (idx === undefined) {
      idx = groups[fingerprint] = 0
    }

    const candidate = this.candidates[idx]
    idx = (idx + 1) % this.candidates.length
    groups[fingerprint] = idx
    const html = evalToken(candidate, ctx)
    emitter.write(html)
  }
} as TagImplOptions
