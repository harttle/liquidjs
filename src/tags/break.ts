import { Context, Emitter, Tag } from '..'
import { MetaNode } from '../template/node'

export default class extends Tag {
  render (ctx: Context, emitter: Emitter) {
    emitter['break'] = true
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
