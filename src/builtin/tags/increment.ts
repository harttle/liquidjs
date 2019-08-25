import { assert } from '../../util/assert'
import { identifier } from '../../parser/lexical'
import { isNumber, stringify } from '../../util/underscore'
import { Emitter, TagToken, Context, ITagImplOptions, Hash } from '../../types'

export default {
  parse: function (token: TagToken) {
    const match = token.args.match(identifier)
    assert(match, `illegal identifier ${token.args}`)
    this.variable = match![0]
  },
  render: function (context: Context, hash: Hash, emitter: Emitter) {
    const scope = context.environments
    if (!isNumber(scope[this.variable])) {
      scope[this.variable] = 0
    }
    const val = scope[this.variable]
    scope[this.variable]++
    emitter.write(stringify(val))
  }
} as ITagImplOptions
