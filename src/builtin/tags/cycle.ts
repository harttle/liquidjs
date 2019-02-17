import assert from 'src/util/assert'
import { value as rValue } from 'src/parser/lexical'
import { evalValue } from 'src/render/syntax'

const groupRE = new RegExp(`^(?:(${rValue.source})\\s*:\\s*)?(.*)$`)
const candidatesRE = new RegExp(rValue.source, 'g')

export default {
  parse: function (tagToken) {
    let match = groupRE.exec(tagToken.args)
    assert(match, `illegal tag: ${tagToken.raw}`)

    this.group = match[1] || ''
    const candidates = match[2]

    this.candidates = []

    while ((match = candidatesRE.exec(candidates))) {
      this.candidates.push(match[0])
    }
    assert(this.candidates.length, `empty candidates: ${tagToken.raw}`)
  },

  render: function (scope) {
    const group = evalValue(this.group, scope)
    const fingerprint = `cycle:${group}:` + this.candidates.join(',')

    const groups = scope.opts.groups = scope.opts.groups || {}
    let idx = groups[fingerprint]

    if (idx === undefined) {
      idx = groups[fingerprint] = 0
    }

    const candidate = this.candidates[idx]
    idx = (idx + 1) % this.candidates.length
    groups[fingerprint] = idx

    return evalValue(candidate, scope)
  }
}
