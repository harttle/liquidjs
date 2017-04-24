const lexical = require('./lexical.js')
const ParseError = require('./util/error.js').ParseError
const assert = require('./util/assert.js')

module.exports = function (Tag, Filter) {
  var stream = {
    init: function (tokens) {
      this.tokens = tokens
      this.handlers = {}
      return this
    },
    on: function (name, cb) {
      this.handlers[name] = cb
      return this
    },
    trigger: function (event, arg) {
      var h = this.handlers[event]
      if (typeof h === 'function') {
        h(arg)
        return true
      }
    },
    start: function () {
      this.trigger('start')
      var token
      while (!this.stopRequested && (token = this.tokens.shift())) {
        if (this.trigger('token', token)) continue
        if (token.type === 'tag' &&
            this.trigger(`tag:${token.name}`, token)) {
          continue
        }
        var template = parseToken(token, this.tokens)
        this.trigger('template', template)
      }
      if (!this.stopRequested) this.trigger('end')
      return this
    },
    stop: function () {
      this.stopRequested = true
      return this
    }
  }

  function parse (tokens) {
    var token
    var templates = []
    while ((token = tokens.shift())) {
      templates.push(parseToken(token, tokens))
    }
    return templates
  }

  function parseToken (token, tokens) {
    try {
      var tpl = null
      if (token.type === 'tag') {
        tpl = parseTag(token, tokens)
      } else if (token.type === 'output') {
        tpl = parseOutput(token.value)
      } else { // token.type === 'html'
        tpl = token
      }
      tpl.token = token
      return tpl
    } catch (e) {
      throw new ParseError(e, token)
    }
  }

  function parseTag (token, tokens) {
    if (token.name === 'continue' || token.name === 'break') return token
    return Tag.construct(token, tokens)
  }

  function parseOutput (str) {
    var match = lexical.matchValue(str)
    assert(match, `illegal output string: ${str}`)

    var initial = match[0]
    str = str.substr(match.index + match[0].length)

    var filters = []
    while ((match = lexical.filter.exec(str))) {
      filters.push([match[0].trim()])
    }

    return {
      type: 'output',
      initial: initial,
      filters: filters.map(str => Filter.construct(str))
    }
  }

  function parseStream (tokens) {
    var s = Object.create(stream)
    return s.init(tokens)
  }

  return {
    parse,
    parseTag,
    parseStream,
    parseOutput
  }
}
