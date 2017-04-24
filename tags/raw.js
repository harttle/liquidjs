const Promise = require('any-promise')

module.exports = function (liquid) {
  liquid.registerTag('raw', {
    parse: function (tagToken, remainTokens) {
      this.tokens = []

      var stream = liquid.parser.parseStream(remainTokens)
      stream
                .on('token', token => {
                  if (token.name === 'endraw') stream.stop()
                  else this.tokens.push(token)
                })
                .on('end', x => {
                  throw new Error(`tag ${tagToken.raw} not closed`)
                })
      stream.start()
    },
    render: function (scope, hash) {
      var tokens = this.tokens.map(token => token.raw).join('')
      return Promise.resolve(tokens)
    }
  })
}
