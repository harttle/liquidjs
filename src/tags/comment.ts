import { Liquid, TopLevelToken, TagToken, Tag } from '..'
import { isTagToken } from '../util'

export default class extends Tag {
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    let depth = 1
    while (remainTokens.length) {
      const token = remainTokens.shift()!
      if (!isTagToken(token)) continue
      if (token.name === 'comment') depth++
      else if (token.name === 'endcomment' && --depth === 0) return
    }
    throw new Error(`tag ${tagToken.getText()} not closed`)
  }
  render () {}
}
