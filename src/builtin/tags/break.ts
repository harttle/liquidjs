import { Emitter, Context, Hash } from '../../types'

export default {
  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    emitter.break = true
  }
}
