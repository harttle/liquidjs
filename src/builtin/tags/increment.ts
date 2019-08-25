import { assert } from '../../util/assert'
import { identifier } from '../../parser/lexical'
import { isNumber } from '../../util/underscore'
import { ITagImplOptions } from '../../template/tag/itag-impl-options'

export default {
  parse: function (token) {
    const match = token.args.match(identifier)
    assert(match, `illegal identifier ${token.args}`)
    this.variable = match![0]
  },
  render: function (context) {
    const scope = context.environments
    if (!isNumber(scope[this.variable])) {
      scope[this.variable] = 0
    }
    const val = scope[this.variable]
    scope[this.variable]++
    return val
  }
} as ITagImplOptions
