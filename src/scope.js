'use strict'
const _ = require('./util/underscore.js')
const lexical = require('./lexical.js')
const assert = require('./util/assert.js')

var Scope = {
  getAll: function () {
    return this.scopes.reduce((ctx, val) => Object.assign(ctx, val), Object.create(null))
  },
  get: function (path) {
    let paths = this.propertyAccessSeq(path)
    let scope = this.findScopeFor(paths[0])
    return paths.reduce((value, key) => this.readProperty(value, key), scope)
  },
  set: function (path, v) {
    let paths = this.propertyAccessSeq(path)
    let scope = this.findScopeFor(paths[0])
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
  push: function (ctx) {
    assert(ctx, `trying to push ${ctx} into scopes`)
    this.scopes.push(ctx)
  },
  pop: function (ctx) {
    if (!arguments.length) {
      return this.scopes.pop()
    }
    let i = this.scopes.findIndex(scope => scope === ctx)
    if (i === -1) {
      throw new TypeError('scope not found, cannot pop')
    }
    return this.scopes.splice(i, 1)[0]
  },
  findScopeFor: function (key) {
    let i = this.scopes.length - 1
    while (i >= 0 && !(key in this.scopes[i])) {
      i--
    }
    if (i < 0) {
      i = this.scopes.length - 1
    }
    return this.scopes[i]
  },
  readProperty: function (obj, key) {
    let val
    if (key === 'size' && (_.isArray(obj) || _.isString(obj))) {
      val = obj.length
    } else if (_.isNil(obj)) {
      val = undefined
    } else {
      val = obj[key]
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
  scope.scopes = [ctx || {}]
  return scope
}
