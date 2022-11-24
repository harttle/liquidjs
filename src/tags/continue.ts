import { Tag, Emitter, Context } from '..'

export default class extends Tag {
  render (ctx: Context, emitter: Emitter) {
    emitter['continue'] = true
  }
}
