import { TagToken, Token, ITagImplOptions, Context, Emitter, Hash } from '../../types'

export default {
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
  render: function (ctx: Context, hash: Hash, emitter: Emitter) {
    emitter.write(this.tokens.map((token: Token) => token.raw).join(''))
  }
} as ITagImplOptions
