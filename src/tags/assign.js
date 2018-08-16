import {lexical} from '../index'
import assert from '../util/assert.js'
import {types} from '../scope'

const re = new RegExp(`(${lexical.identifier.source})\\s*=(.*)`)

module.exports = function (liquid) {
  liquid.registerTag('assign', {
    parse: function (token) {
      let match = token.args.match(re)
      assert(match, `illegal token ${token.raw}`)
      this.key = match[1]
      this.value = match[2]
    },
    render: function (scope) {
      let ctx = Object.create(types.AssignScope)
      ctx[this.key] = liquid.evalValue(this.value, scope)
      scope.push(ctx)
      return Promise.resolve('')
    }
  })
}
