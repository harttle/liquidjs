import { TagToken, Liquid, TopLevelToken, Tag } from '..'
import { StaticNode } from '../template'

export default class extends Tag {
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    if (tagToken.args.search(/\n\s*[^#\s]/g) !== -1) {
      throw new Error('every line of an inline comment must start with a \'#\' character')
    }
  }
  render () { }

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
