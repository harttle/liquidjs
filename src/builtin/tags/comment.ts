export default {
  parse: function (tagToken, remainTokens) {
    const stream = this.liquid.parser.parseStream(remainTokens)
    stream
      .on('token', token => {
        if (token.name === 'endcomment') stream.stop()
      })
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })
    stream.start()
  }
}
