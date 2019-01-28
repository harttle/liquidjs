import assert from '../util/assert.js'
import { identifier } from '../lexical.js'
import { create } from '../util/underscore.js'

export default function (liquid, Liquid) {
  const re = new RegExp(`(${identifier.source})\\s*=([^]*)`)
  const { AssignScope } = Liquid.Types

  liquid.registerTag('assign', {
    parse: function (token) {
      const match = token.args.match(re)
      assert(match, `illegal token ${token.raw}`)
      this.key = match[1]
      this.value = match[2]
    },
    render: function (scope) {
      const ctx = create(AssignScope)
      ctx[this.key] = liquid.evalValue(this.value, scope)
      scope.push(ctx)
      return Promise.resolve('')
    }
  })
}
