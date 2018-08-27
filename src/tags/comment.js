export default function (liquid) {
  liquid.registerTag('comment', {
    parse: function (tagToken, remainTokens) {
      const stream = liquid.parser.parseStream(remainTokens)
      stream
        .on('token', token => {
          if (token.name === 'endcomment') stream.stop()
        })
        .on('end', x => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })
      stream.start()
    }
  })
}
