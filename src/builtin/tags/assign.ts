import { assert } from '../../util/assert'
import { identifier } from '../../parser/lexical'
import { ITagImplOptions, TagToken, Context } from '../../types'

const re = new RegExp(`(${identifier.source})\\s*=([^]*)`)

export default {
  parse: function (token: TagToken) {
    const match = token.args.match(re) as RegExpMatchArray
    assert(match, `illegal token ${token.raw}`)
    this.key = match[1]
    this.value = match[2]
  },
  render: async function (ctx: Context) {
    ctx.front()[this.key] = ctx.sync
      ? this.liquid.evalValueSync(this.value, ctx)
      : await this.liquid.evalValue(this.value, ctx)
  }
} as ITagImplOptions
