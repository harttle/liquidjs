import { assert } from '../../util/assert'
import { value as rValue } from '../../parser/lexical'
import { Emitter, Expression, TagToken, Context, TagImplOptions } from '../../types'

const groupRE = new RegExp(`^(?:(${rValue.source})\\s*:\\s*)?(.*)$`)
const candidatesRE = new RegExp(rValue.source, 'g')

export default {
  parse: function (tagToken: TagToken) {
    let match: RegExpExecArray | null = groupRE.exec(tagToken.args) as RegExpExecArray
    assert(match, `illegal tag: ${tagToken.raw}`)

    this.group = new Expression(match[1])
    const candidates = match[2]

    this.candidates = []

    while ((match = candidatesRE.exec(candidates))) {
      this.candidates.push(match[0])
    }
    assert(this.candidates.length, `empty candidates: ${tagToken.raw}`)
  },

  render: function * (ctx: Context, emitter: Emitter) {
    const group = yield this.group.value(ctx)
    const fingerprint = `cycle:${group}:` + this.candidates.join(',')
    const groups = ctx.getRegister('cycle')
    let idx = groups[fingerprint]

    if (idx === undefined) {
      idx = groups[fingerprint] = 0
    }

    const candidate = this.candidates[idx]
    idx = (idx + 1) % this.candidates.length
    groups[fingerprint] = idx
    const html = yield new Expression(candidate).value(ctx)
    emitter.write(html)
  }
} as TagImplOptions
