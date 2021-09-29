import { Emitter, Context } from '../../types'

export default {
  render: function (ctx: Context, emitter: Emitter) {
    emitter['break'] = true
  }
}
