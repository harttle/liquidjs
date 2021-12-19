import { Value } from '../../template/value'
import { Emitter } from '../../emitters/emitter'
import { TagImplOptions, TagToken, Context } from '../../types'

export default {
  parse: function (token: TagToken) {
    this.value = new Value(token.args, this.liquid)
  },
  render: function * (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }
} as TagImplOptions
