import { Context, Emitter, Tag } from '..'
import { StaticNode } from '../template'

export default class extends Tag {
  render (ctx: Context, emitter: Emitter) {
    emitter['break'] = true
  }

  public node (): StaticNode {
    return {
      token: this.token,
      values: [],
      children: [],
      blockScope: [],
      templateScope: []
    }
  }
}
