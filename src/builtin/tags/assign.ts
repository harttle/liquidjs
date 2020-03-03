import { assert } from '../../util/assert'
import { identifier } from '../../parser/lexical'
import { TagImplOptions, TagToken, Context } from '../../types'

const re = new RegExp(`(${identifier.source})\\s*=([^]*)`)

export default {
  parse: function (token: TagToken) {
    const match = token.args.match(re) as RegExpMatchArray
    assert(match, `illegal token ${token.raw}`)
    this.key = match[1]
    this.value = match[2]
  },
  render: function * (ctx: Context) {
    ctx.bottom()[this.key] = yield this.liquid._evalValue(this.value, ctx)
  }
} as TagImplOptions
