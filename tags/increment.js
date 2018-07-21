'use strict'
const Liquid = require('..')
const assert = require('../src/util/assert.js')
const lexical = Liquid.lexical
const types = require('../src/scope').types

module.exports = function (liquid) {
  liquid.registerTag('increment', {
    parse: function (token) {
      let match = token.args.match(lexical.identifier)
      assert(match, `illegal identifier ${token.args}`)
      this.variable = match[0]
    },
    render: function (scope, hash) {
      let context = scope.findContextFor(
        this.variable,
        ctx => {
          return Object.getPrototypeOf(ctx) !== types.CaptureScope &&
          Object.getPrototypeOf(ctx) !== types.AssignScope
        }
      )
      if (!context) {
        context = Object.create(types.IncrementScope)
        scope.unshift(context)
      }
      if (typeof context[this.variable] !== 'number') {
        context[this.variable] = 0
      }
      let val = context[this.variable]
      context[this.variable]++
      return val
    }
  })
}
