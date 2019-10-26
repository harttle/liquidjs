import { Emitter, Context, Hash } from '../../types'

export default {
  render: function (ctx: Context, hash: Hash, emitter: Emitter) {
    emitter.continue = true
  }
}
