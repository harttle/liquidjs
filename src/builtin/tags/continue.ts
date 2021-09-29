import { Emitter, Context } from '../../types'

export default {
  render: function (ctx: Context, emitter: Emitter) {
    emitter['continue'] = true
  }
}
