import { Tag, Emitter, Context } from '..'
import { StaticNode } from '../template'

export default class extends Tag {
  render (ctx: Context, emitter: Emitter) {
    emitter['continue'] = true
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
