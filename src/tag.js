'use strict'
const lexical = require('./lexical.js')
const Syntax = require('./syntax.js')
const assert = require('./util/assert.js')

function hash (markup, scope) {
  let obj = {}
  let match
  lexical.hashCapture.lastIndex = 0
  while ((match = lexical.hashCapture.exec(markup))) {
    let k = match[1]
    let v = match[2]
    obj[k] = Syntax.evalValue(v, scope)
  }
  return obj
}

module.exports = function () {
  let tagImpls = {}

  let _tagInstance = {
    render: function (scope) {
      let obj = hash(this.token.args, scope)
      let impl = this.tagImpl
      if (typeof impl.render !== 'function') {
        return Promise.resolve('')
      }
      return Promise.resolve().then(() => impl.render(scope, obj))
    },
    parse: function (token, tokens) {
      this.type = 'tag'
      this.token = token
      this.name = token.name

      let tagImpl = tagImpls[this.name]
      assert(tagImpl, `tag ${this.name} not found`)
      this.tagImpl = Object.create(tagImpl)
      if (this.tagImpl.parse) {
        this.tagImpl.parse(token, tokens)
      }
    }
  }

  function register (name, tag) {
    tagImpls[name] = tag
  }

  function construct (token, tokens) {
    let instance = Object.create(_tagInstance)
    instance.parse(token, tokens)
    return instance
  }

  function clear () {
    tagImpls = {}
  }

  return {
    construct,
    register,
    clear
  }
}
