'use strict'
const Liquid = require('..')
const lexical = Liquid.lexical
const withRE = new RegExp(`with\\s+(${lexical.value.source})`)
const staticFileRE = /[^\s,]+/
const assert = require('../src/util/assert.js')

module.exports = function (liquid) {
  liquid.registerTag('include', {
    parse: function (token) {
      let match = staticFileRE.exec(token.args)
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
      let pFilepath
      if (scope.opts.dynamicPartials) {
        if (lexical.quotedLine.exec(this.value)) {
          let template = this.value.slice(1, -1)
          pFilepath = liquid.parseAndRender(template, scope.getAll(), scope.opts)
        } else {
          pFilepath = Promise.resolve(Liquid.evalValue(this.value, scope))
        }
      } else {
        pFilepath = Promise.resolve(this.staticValue)
      }

      let originBlocks = scope.opts.blocks
      let originBlockMode = scope.opts.blockMode

      return pFilepath
        .then(filepath => {
          assert(filepath, `cannot include with empty filename`)
          scope.opts.blocks = {}
          scope.opts.blockMode = 'output'
          if (this.with) {
            hash[filepath] = Liquid.evalValue(this.with, scope)
          }
          return liquid.getTemplate(filepath, scope.opts.root)
        })
        .then(templates => {
          scope.push(hash)
          return liquid.renderer.renderTemplates(templates, scope)
        })
        .then((html) => {
          scope.pop(hash)
          scope.opts.blocks = originBlocks
          scope.opts.blockMode = originBlockMode
          return html
        })
    }
  })
}
