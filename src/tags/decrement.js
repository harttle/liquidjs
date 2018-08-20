import assert from '../util/assert.js'

export default function (liquid, Liquid) {
  const lexical = Liquid.lexical
  const {CaptureScope, AssignScope, DecrementScope} = Liquid.Types

  liquid.registerTag('decrement', {
    parse: function (token) {
      const match = token.args.match(lexical.identifier)
      assert(match, `illegal identifier ${token.args}`)
      this.variable = match[0]
    },
    render: function (scope, hash) {
      let context = scope.findContextFor(
        this.variable,
        ctx => {
          return Object.getPrototypeOf(ctx) !== CaptureScope &&
          Object.getPrototypeOf(ctx) !== AssignScope
        }
      )
      if (!context) {
        context = Object.create(DecrementScope)
        scope.unshift(context)
      }
      if (typeof context[this.variable] !== 'number') {
        context[this.variable] = 0
      }
      return --context[this.variable]
    }
  })
}
