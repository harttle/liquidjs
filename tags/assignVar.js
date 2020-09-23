const Liquid = require('..')
const lexical = Liquid.lexical
const Promise = require('any-promise')
const re = new RegExp(`(${lexical.identifier.source})\\s*=(.*)`)
const assert = require('../src/util/assert.js')

module.exports = function (liquid) {
  liquid.registerTag('assignVar', {
    parse: function (token) {
      var match = token.args.match(re)
      assert(match, `illegal token ${token.raw}`)
      this.key = match[1]
      this.value = match[2]
    },
    render: function (scope) {
      const value = liquid.evalValue(this.value, scope)
      const actualValue = scope.get(value)
      scope.set(this.key, actualValue)
      return Promise.resolve('')
    }
  })
}
