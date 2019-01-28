import assert from '../util/assert.js'
import { value as rValue } from '../lexical.js'

export default function (liquid, Liquid) {
  const groupRE = new RegExp(`^(?:(${rValue.source})\\s*:\\s*)?(.*)$`)
  const candidatesRE = new RegExp(rValue.source, 'g')

  liquid.registerTag('cycle', {

    parse: function (tagToken, remainTokens) {
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

    render: function (scope, hash) {
      const group = Liquid.evalValue(this.group, scope)
      const fingerprint = `cycle:${group}:` + this.candidates.join(',')

      const groups = scope.opts.groups = scope.opts.groups || {}
      let idx = groups[fingerprint]

      if (idx === undefined) {
        idx = groups[fingerprint] = 0
      }

      const candidate = this.candidates[idx]
      idx = (idx + 1) % this.candidates.length
      groups[fingerprint] = idx

      return Liquid.evalValue(candidate, scope)
    }
  })
}
