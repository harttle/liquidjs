import { TagToken, TopLevelToken, TagImplOptions } from '../../types'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    this.tokens = []

    const stream = this.liquid.parser.parseStream(remainTokens)
    stream
      .on('token', (token: TagToken) => {
        if (token.name === 'endraw') stream.stop()
        else this.tokens.push(token)
      })
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`)
      })
    stream.start()
  },
  render: function () {
    return this.tokens.map((token: TopLevelToken) => token.getText()).join('')
  }
} as TagImplOptions
