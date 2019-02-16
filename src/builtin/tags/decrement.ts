import assert from 'src/util/assert'
import { identifier } from 'src/parser/lexical'
import { CaptureScope, AssignScope, DecrementScope } from 'src/scope/scopes'

export default {
  parse: function (token) {
    const match = token.args.match(identifier)
    assert(match, `illegal identifier ${token.args}`)
    this.variable = match[0]
  },
  render: function (scope, hash) {
    let context = scope.findContextFor(
      this.variable,
      ctx => {
        return !(ctx instanceof CaptureScope) && !(ctx instanceof AssignScope)
      }
    )
    if (!context) {
      context = new DecrementScope()
      scope.unshift(context)
    }
    if (typeof context[this.variable] !== 'number') {
      context[this.variable] = 0
    }
    return --context[this.variable]
  }
}
