const _ = require('./util/underscore.js')
const lexical = require('./lexical.js')
const assert = require('./util/assert.js')

var Scope = {
  getAll: function () {
    var ctx = {}
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      _.assign(ctx, this.scopes[i])
    }
    return ctx
  },
  get: function (str) {
    try {
      return this.getPropertyByPath(this.scopes, str)
    } catch (e) {
      if (!/undefined variable/.test(e.message) || this.opts.strict_variables) {
        throw e
      }
    }
  },
  set: function (k, v) {
    var scope = this.findScopeFor(k)
    setPropertyByPath(scope, k, v)
    return this
  },
  push: function (ctx) {
    assert(ctx, `trying to push ${ctx} into scopes`)
    return this.scopes.push(ctx)
  },
  pop: function () {
    return this.scopes.pop()
  },
  findScopeFor: function (key) {
    var i = this.scopes.length - 1
    while (i >= 0 && !(key in this.scopes[i])) {
      i--
    }
    if (i < 0) {
      i = this.scopes.length - 1
    }
    return this.scopes[i]
  },
  unshift: function (ctx) {
    assert(ctx, `trying to push ${ctx} into scopes`)
    return this.scopes.unshift(ctx)
  },
  shift: function () {
    return this.scopes.shift()
  },

  getPropertyByPath: function (scopes, path) {
    var paths = this.propertyAccessSeq(path + '')
    if (!paths.length) {
      throw new TypeError('undefined variable: ' + path)
    }
    var key = paths.shift()
    var value = getValueFromScopes(key, scopes)
    return paths.reduce(
      (value, key) => {
        if (_.isNil(value)) {
          throw new TypeError('undefined variable: ' + key)
        }
        return getValueFromParent(key, value)
      },
      value
    )
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
    var seq = []
    var name = ''
    var j
    var i = 0
    while (i < str.length) {
      switch (str[i]) {
        case '[':
          push()

          var delemiter = str[i + 1]
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
    return seq

    function push () {
      if (name.length) seq.push(name)
      name = ''
    }
  }
}

function setPropertyByPath (obj, path, val) {
  var paths = (path + '').replace(/\[/g, '.').replace(/\]/g, '').split('.')
  for (var i = 0; i < paths.length; i++) {
    var key = paths[i]
    if (!_.isObject(obj)) {
      // cannot set property of non-object
      return
    }
    // for end point
    if (i === paths.length - 1) {
      return (obj[key] = val)
    }
    // if path not exist
    if (undefined === obj[key]) {
      obj[key] = {}
    }
    obj = obj[key]
  }
}

function getValueFromParent (key, value) {
  return (key === 'size' && (_.isArray(value) || _.isString(value)))
    ? value.length
    : value[key]
}

function getValueFromScopes (key, scopes) {
  for (var i = scopes.length - 1; i > -1; i--) {
    var scope = scopes[i]
    if (scope.hasOwnProperty(key)) {
      return scope[key]
    }
  }
  throw new TypeError('undefined variable: ' + key)
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
