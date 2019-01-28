import { hashCapture } from './lexical.js'
import { create } from './util/underscore.js'
import { evalValue } from './syntax.js'
import assert from './util/assert.js'

function hash (markup, scope) {
  const obj = {}
  let match
  hashCapture.lastIndex = 0
  while ((match = hashCapture.exec(markup))) {
    const k = match[1]
    const v = match[2]
    obj[k] = evalValue(v, scope)
  }
  return obj
}

export default function () {
  let tagImpls = {}

  const _tagInstance = {
    render: async function (scope) {
      const obj = hash(this.token.args, scope)
      const impl = this.tagImpl
      if (typeof impl.render !== 'function') {
        return ''
      }
      return impl.render(scope, obj)
    },
    parse: function (token, tokens) {
      this.type = 'tag'
      this.token = token
      this.name = token.name

      const tagImpl = tagImpls[this.name]
      assert(tagImpl, `tag ${this.name} not found`)
      this.tagImpl = create(tagImpl)
      if (this.tagImpl.parse) {
        this.tagImpl.parse(token, tokens)
      }
    }
  }

  function register (name, tag) {
    tagImpls[name] = tag
  }

  function construct (token, tokens) {
    const instance = create(_tagInstance)
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
