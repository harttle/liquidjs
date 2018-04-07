const Liquid = require('..')
const lexical = Liquid.lexical
const withRE = new RegExp(`with\\s+(${lexical.value.source})`)
const staticFileRE = /[^\s,]+/
const assert = require('../src/util/assert.js')

module.exports = function (liquid) {
  liquid.registerTag('include', {
    parse: function (token) {
      var match = staticFileRE.exec(token.args)
      if (match) {
        this.staticValue = match[0]
      }

      match = lexical.value.exec(token.args)
      if (match) {
        this.value = match[0]
      }

      match = withRE.exec(token.args)
      if (match) {
        this.with = match[1]
      }
    },
    render: function (scope, hash) {
      var filepath = scope.opts.dynamicPartials
        ? Liquid.evalValue(this.value, scope)
        : this.staticValue
      assert(filepath, `cannot include with empty filename`)

      var originBlocks = scope.opts.blocks
      var originBlockMode = scope.opts.blockMode
      scope.opts.blocks = {}
      scope.opts.blockMode = 'output'

      if (this.with) {
        hash[filepath] = Liquid.evalValue(this.with, scope)
      }
      return liquid.getTemplate(filepath, scope.opts.root)
        .then((templates) => {
          scope.push(hash)
          return liquid.renderer.renderTemplates(templates, scope)
        })
        .then((html) => {
          scope.pop()
          scope.opts.blocks = originBlocks
          scope.opts.blockMode = originBlockMode
          return html
        })
    }
  })
}
