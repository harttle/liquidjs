'use strict'
const _ = require('./util/underscore.js')
const lexical = require('./lexical.js')
const assert = require('./util/assert.js')

var Scope = {
  getAll: function () {
    return this.contexts.reduce((ctx, val) => Object.assign(ctx, val), Object.create(null))
  },
  get: function (path) {
    let paths = this.propertyAccessSeq(path)
    let scope = this.findContextFor(paths[0]) || _.last(this.contexts)
    return paths.reduce((value, key) => this.readProperty(value, key), scope)
  },
  set: function (path, v) {
    let paths = this.propertyAccessSeq(path)
    let scope = this.findContextFor(paths[0]) || _.last(this.contexts)
    paths.some((key, i) => {
      if (!_.isObject(scope)) {
        return true
      }
      if (i === paths.length - 1) {
        scope[key] = v
        return true
      }
      if (undefined === scope[key]) {
        scope[key] = {}
      }
      scope = scope[key]
    })
  },
  unshift: function (ctx) {
    return this.contexts.unshift(ctx)
  },
  push: function (ctx) {
    return this.contexts.push(ctx)
  },
  pop: function (ctx) {
    if (!arguments.length) {
      return this.contexts.pop()
    }
    let i = this.contexts.findIndex(scope => scope === ctx)
    if (i === -1) {
      throw new TypeError('scope not found, cannot pop')
    }
    return this.contexts.splice(i, 1)[0]
  },
  findContextFor: function (key, filter) {
    filter = filter || (() => true)
    for (let i = this.contexts.length - 1; i >= 0; i--) {
      let candidate = this.contexts[i]
      if (!filter(candidate)) continue
      if (key in candidate) {
        return candidate
      }
    }
    return null
  },
  readProperty: function (obj, key) {
    let val
    if (_.isNil(obj)) {
      val = undefined
    } else {
      if (typeof obj.to_liquid === 'function') {
        obj = obj.to_liquid()
      } else if (typeof obj.toLiquid === 'function') {
        obj = obj.toLiquid()
      }

      if (key === 'size' && (_.isArray(obj) || _.isString(obj))) {
        val = obj.length
      } else {
        val = obj[key]
      }
    }
    if (_.isNil(val) && this.opts.strict_variables) {
      throw new TypeError(`undefined variable: ${key}`)
    }
    return val
  },

  /*
   * Parse property access sequence from access string
   * @example
   * accessSeq("foo.bar")            // ['foo', 'bar']
   * accessSeq("foo['bar']")      // ['foo', 'bar']
   * accessSeq("foo['b]r']")      // ['foo', 'b]r']
   * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
   */
  propertyAccessSeq: function (str) {
    str = String(str)
    let seq = []
    let name = ''
    let j
    let i = 0
    while (i < str.length) {
      switch (str[i]) {
        case '[':
          push()

          let delemiter = str[i + 1]
          if (/['"]/.test(delemiter)) { // foo["bar"]
            j = str.indexOf(delemiter, i + 2)
            assert(j !== -1, `unbalanced ${delemiter}: ${str}`)
            name = str.slice(i + 2, j)
            push()
            i = j + 2
          } else { // foo[bar.coo]
            j = matchRightBracket(str, i + 1)
            assert(j !== -1, `unbalanced []: ${str}`)
            name = str.slice(i + 1, j)
            if (!lexical.isInteger(name)) { // foo[bar] vs. foo[1]
              name = this.get(name)
            }
            push()
            i = j + 1
          }
          break
        case '.':// foo.bar, foo[0].bar
          push()
          i++
          break
        default:// foo.bar
          name += str[i]
          i++
      }
    }
    push()

    if (!seq.length) {
      throw new TypeError(`invalid path:"${str}"`)
    }
    return seq

    function push () {
      if (name.length) seq.push(name)
      name = ''
    }
  }
}

function matchRightBracket (str, begin) {
  var stack = 1 // count of '[' - count of ']'
  for (var i = begin; i < str.length; i++) {
    if (str[i] === '[') {
      stack++
    }
    if (str[i] === ']') {
      stack--
      if (stack === 0) {
        return i
      }
    }
  }
  return -1
}

exports.factory = function (ctx, opts) {
  var defaultOptions = {
    dynamicPartials: true,
    strict_variables: false,
    strict_filters: false,
    blocks: {},
    root: []
  }
  var scope = Object.create(Scope)
  scope.opts = _.assign(defaultOptions, opts)
  scope.contexts = [ctx || {}]
  return scope
}

exports.types = {
  AssignScope: Object.create(null),
  CaptureScope: Object.create(null),
  IncrementScope: Object.create(null),
  DecrementScope: Object.create(null)
}
