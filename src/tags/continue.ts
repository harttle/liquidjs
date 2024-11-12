import { Tag, Emitter, Context } from '..'
import { MetaNode } from '../template/node'

export default class extends Tag {
  render (ctx: Context, emitter: Emitter) {
    emitter['continue'] = true
  }

  public node (): MetaNode {
    return {
      token: this.token,
      values: [],
      children: [],
      blockScope: [],
      templateScope: []
    }
  }
}
