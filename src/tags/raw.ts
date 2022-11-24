import { Liquid, TagToken, TopLevelToken, Tag } from '..'
import { isTagToken } from '../util'

export default class extends Tag {
  private tokens: TopLevelToken[] = []
  constructor (tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid)
    while (remainTokens.length) {
      const token = remainTokens.shift()!
      if (isTagToken(token) && token.name === 'endraw') return
      this.tokens.push(token)
    }
    throw new Error(`tag ${tagToken.getText()} not closed`)
  }
  render () {
    return this.tokens.map((token: TopLevelToken) => token.getText()).join('')
  }
}
