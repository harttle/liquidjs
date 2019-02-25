import assert from '../../util/assert'
import { identifier } from '../../parser/lexical'
import { CaptureScope, AssignScope, DecrementScope } from '../../scope/scopes'
import TagToken from '../../parser/tag-token'
import Scope from '../../scope/scope'
import ITagImplOptions from '../../template/tag/itag-impl-options'

export default {
  parse: function (token: TagToken) {
    const match = token.args.match(identifier) as RegExpMatchArray
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
} as ITagImplOptions
