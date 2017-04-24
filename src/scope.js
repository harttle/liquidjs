const _ = require('./util/underscore.js')
const lexical = require('./lexical.js')
const assert = require('./util/assert.js')
const toStr = Object.prototype.toString

var Scope = {
  getAll: function () {
    var ctx = {}
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      _.assign(ctx, this.scopes[i])
    }
    return ctx
  },
  get: function (str) {
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      try {
        return this.getPropertyByPath(this.scopes[i], str)
      } catch (e) {
        if (/undefined variable/.test(e.message)) {
          continue
        }
        if (/Cannot read property/.test(e.message)) {
          if (this.opts.strict_variables) {
            e.message += ': ' + str
            throw e
          } else {
            continue
          }
        } else {
          e.message += ': ' + str
          throw e
        }
      }
    }
    if (this.opts.strict_variables) {
      throw new TypeError('undefined variable: ' + str)
    }
  },
  set: function (k, v) {
    this.setPropertyByPath(this.scopes[this.scopes.length - 1], k, v)
    return this
  },
  push: function (ctx) {
    assert(ctx, `trying to push ${ctx} into scopes`)
    return this.scopes.push(ctx)
  },
  pop: function () {
    return this.scopes.pop()
  },
  unshift: function (ctx) {
    assert(ctx, `trying to push ${ctx} into scopes`)
    return this.scopes.unshift(ctx)
  },
  shift: function () {
    return this.scopes.shift()
  },
  setPropertyByPath: function (obj, path, val) {
    if (_.isString(path)) {
      var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
      for (var i = 0; i < paths.length; i++) {
        var key = paths[i]
        if (i === paths.length - 1) {
          return (obj[key] = val)
        }
        if (undefined === obj[key]) obj[key] = {}
                // case for readonly objects
        obj = obj[key] || {}
      }
    }
  },

  getPropertyByPath: function (obj, path) {
    var paths = this.propertyAccessSeq(path + '')
    var varName = paths.shift()
    if (!obj.hasOwnProperty(varName)) {
      throw new TypeError('undefined variable')
    }
    var variable = obj[varName]
    var lastName = paths.pop()
    paths.forEach(p => (variable = variable[p]))
    if (undefined !== lastName) {
      if (lastName === 'size' &&
                (toStr.call(variable) === '[object Array]' ||
                    toStr.call(variable) === '[object String]')) {
        return variable.length
      }
      variable = variable[lastName]
    }
    return variable
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
    for (var i = 0; i < str.length; i++) {
      if (str[i] === '[') {
        seq.push(name)
        name = ''

        var delemiter = str[i + 1]
        if (delemiter !== "'" && delemiter !== '"') {
          // foo[bar.coo]
          var j = matchRightBracket(str, i + 1)
          assert(j !== -1, `unbalanced []: ${str}`)
          name = str.slice(i + 1, j)
          if (lexical.isInteger(name)) {
            // foo[1]
            seq.push(name)
          } else {
            // foo["bar"]
            seq.push(this.get(name))
          }
          name = ''
          i = j
        } else {
          // foo["bar"]
          j = str.indexOf(delemiter, i + 2)
          assert(j !== -1, `unbalanced ${delemiter}: ${str}`)
          name = str.slice(i + 2, j)
          seq.push(name)
          name = ''
          i = j + 2
        }
      } else if (str[i] === '.') {
        // foo.bar
        seq.push(name)
        name = ''
      } else {
        // foo.bar
        name += str[i]
      }
    }
    if (name.length) seq.push(name)
    return seq
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
  opts = _.assign({
    strict_variables: false,
    strict_filters: false,
    blocks: {},
    root: []
  }, opts)

  ctx = _.assign(ctx, {
    liquid: opts
  })

  var scope = Object.create(Scope)
  scope.opts = opts
  scope.scopes = [ctx]
  return scope
}
