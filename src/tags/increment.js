import assert from '../util/assert'
import { create } from '../util/underscore'
import { identifier } from '../lexical'

export default function (liquid, Liquid) {
  const { CaptureScope, AssignScope, IncrementScope } = Liquid.Types

  liquid.registerTag('increment', {
    parse: function (token) {
      const match = token.args.match(identifier)
      assert(match, `illegal identifier ${token.args}`)
      this.variable = match[0]
    },
    render: function (scope, hash) {
      let context = scope.findContextFor(
        this.variable,
        ctx => {
          const proto = Object.getPrototypeOf(ctx)
          return proto !== CaptureScope && proto !== AssignScope
        }
      )
      if (!context) {
        context = create(IncrementScope)
        scope.unshift(context)
      }
      if (typeof context[this.variable] !== 'number') {
        context[this.variable] = 0
      }
      const val = context[this.variable]
      context[this.variable]++
      return val
    }
  })
}
