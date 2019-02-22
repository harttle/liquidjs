import TagToken from 'src/parser/tag-token'
import Token from 'src/parser/token'
import ITagImplOptions from 'src/template/tag/itag-impl-options'

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    const stream = this.liquid.parser.parseStream(remainTokens)
    stream
      .on('token', (token: TagToken) => {
        if (token.name === 'endcomment') stream.stop()
      })
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })
    stream.start()
  }
} as ITagImplOptions
