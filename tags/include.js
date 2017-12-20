const Liquid = require('..')
const lexical = Liquid.lexical
const withRE = new RegExp(`with\\s+(${lexical.value.source})`)
const assert = require('../src/util/assert.js')

module.exports = function (liquid) {
  liquid.registerTag('include', {
    parse: function (token) {
      var match = lexical.value.exec(token.args)
      assert(match, `illegal token ${token.raw}`)
      this.value = match[0]

      match = withRE.exec(token.args)
      if (match) {
        this.with = match[1]
      }
    },
    render: function (scope, hash) {
      var filepath = this.value
      if (scope.opts.dynamicPartials) {
        filepath = Liquid.evalValue(this.value, scope)
      }

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
