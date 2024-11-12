import { Liquid, TopLevelToken, TagToken, Tag } from '..'
import { MetaNode } from '../template/node'
import { isTagToken } from '../util'

export default class extends Tag {
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    while (remainTokens.length) {
      const token = remainTokens.shift()!
      if (isTagToken(token) && token.name === 'endcomment') return
    }
    throw new Error(`tag ${tagToken.getText()} not closed`)
  }
  render () {}

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
