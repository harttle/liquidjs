import * as lexical from './lexical.js'
import { create } from './util/underscore.js'
import { ParseError } from './util/error.js'
import assert from './util/assert.js'

export default function (Tag, Filter) {
  const stream = {
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
      const h = this.handlers[event]
      if (typeof h === 'function') {
        h(arg)
        return true
      }
    },
    start: function () {
      this.trigger('start')
      let token
      while (!this.stopRequested && (token = this.tokens.shift())) {
        if (this.trigger('token', token)) continue
        if (token.type === 'tag' &&
            this.trigger(`tag:${token.name}`, token)) {
          continue
        }
        const template = parseToken(token, this.tokens)
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
    let token
    const templates = []
    while ((token = tokens.shift())) {
      templates.push(parseToken(token, tokens))
    }
    return templates
  }

  function parseToken (token, tokens) {
    try {
      let tpl = null
      if (token.type === 'tag') {
        tpl = parseTag(token, tokens)
      } else if (token.type === 'value') {
        tpl = parseValue(token.value)
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

  function parseValue (str) {
    let match = lexical.matchValue(str)
    assert(match, `illegal value string: ${str}`)

    const initial = match[0]
    str = str.substr(match.index + match[0].length)

    const filters = []
    while ((match = lexical.filter.exec(str))) {
      filters.push([match[0].trim()])
    }

    return {
      type: 'value',
      initial: initial,
      filters: filters.map(str => Filter.construct(str))
    }
  }

  function parseStream (tokens) {
    const s = create(stream)
    return s.init(tokens)
  }

  return {
    parse,
    parseTag,
    parseStream,
    parseValue
  }
}
