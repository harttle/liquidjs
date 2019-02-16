import assert from 'src/util/assert'
import { identifier } from 'src/parser/lexical'
import { AssignScope } from 'src/scope/scopes'

const re = new RegExp(`(${identifier.source})\\s*=([^]*)`)

export default {
  parse: function (token) {
    const match = token.args.match(re)
    assert(match, `illegal token ${token.raw}`)
    this.key = match[1]
    this.value = match[2]
  },
  render: function (scope) {
    const ctx = new AssignScope()
    ctx[this.key] = this.liquid.evalValue(this.value, scope)
    scope.push(ctx)
    return Promise.resolve('')
  }
}
