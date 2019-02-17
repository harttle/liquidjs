import assert from 'src/util/assert'
import { identifier } from 'src/parser/lexical'
import { CaptureScope, AssignScope, DecrementScope } from 'src/scope/scopes'
import TagToken from 'src/parser/tag-token'
import Scope from 'src/scope/scope'

export default {
  parse: function (token: TagToken) {
    const match = token.args.match(identifier)
    assert(match, `illegal identifier ${token.args}`)
    this.variable = match[0]
  },
  render: function (scope: Scope) {
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
