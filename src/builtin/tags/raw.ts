import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import ITagImplOptions from '../../template/tag/itag-impl-options'

export default <ITagImplOptions>{
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    this.tokens = []

    const stream = this.liquid.parser.parseStream(remainTokens)
    stream
      .on('token', (token: TagToken) => {
        if (token.name === 'endraw') stream.stop()
        else this.tokens.push(token)
      })
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })
    stream.start()
  },
  render: function () {
    return this.tokens.map((token: Token) => token.raw).join('')
  }
}
