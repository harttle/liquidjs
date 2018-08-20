export default function (liquid) {
  liquid.registerTag('raw', {
    parse: function (tagToken, remainTokens) {
      this.tokens = []

      const stream = liquid.parser.parseStream(remainTokens)
      stream
        .on('token', token => {
          if (token.name === 'endraw') stream.stop()
          else this.tokens.push(token)
        })
        .on('end', () => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })
      stream.start()
    },
    render: function (scope, hash) {
      return this.tokens.map(token => token.raw).join('')
    }
  })
}
