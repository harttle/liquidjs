import assert from 'src/util/assert'
import { identifier } from 'src/parser/lexical'
import { CaptureScope, AssignScope, IncrementScope } from 'src/scope/scopes'
import ITagImplOptions from 'src/template/tag/itag-impl-options';

export default {
  parse: function (token) {
    const match = token.args.match(identifier)
    assert(match, `illegal identifier ${token.args}`)
    this.variable = match![0]
  },
  render: function (scope) {
    let context = scope.findContextFor(
      this.variable,
      ctx => {
        return !(ctx instanceof CaptureScope) && !(ctx instanceof AssignScope)
      }
    )
    if (!context) {
      context = new IncrementScope()
      scope.unshift(context)
    }
    if (typeof context[this.variable] !== 'number') {
      context[this.variable] = 0
    }
    const val = context[this.variable]
    context[this.variable]++
    return val
  }
} as ITagImplOptions