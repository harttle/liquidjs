const lexical = require('./lexical.js')
const TokenizationError = require('./util/error.js').TokenizationError
const _ = require('./util/underscore.js')
const assert = require('../src/util/assert.js')

function parse (html, filepath, options) {
  assert(_.isString(html), 'illegal input')

  var rLiquid = /({%-?([\s\S]*?)-?%})|({{-?([\s\S]*?)-?}})/g
  var currIndent = 0
  var lineNumber = LineNumber()
  var lastMatchEnd = 0
  var tokens = []

  for (var match; (match = rLiquid.exec(html)); lastMatchEnd = rLiquid.lastIndex) {
    if (match.index > lastMatchEnd) {
      tokens.push(parseHTMLToken(lastMatchEnd, match.index))
    }
    tokens.push(match[1] ? parseTagToken(match) : parseOutputToken(match))
  }
  if (html.length > lastMatchEnd) {
    tokens.push(parseHTMLToken(lastMatchEnd, html.length))
  }
  whiteSpaceCtrl(tokens, options)
  return tokens

  function parseOutputToken (match) {
    var token = factory('output', 3, match)
    token.trim_left = (match[3].slice(0, 3) === '{{-')
    token.trim_right = (match[3].slice(-3) === '-}}')
    return token
  }

  function parseTagToken (result) {
    var token = factory('tag', 1, result)
    var match = token.value.match(lexical.tagLine)
    if (!match) {
      throw new TokenizationError(`illegal tag syntax`, token)
    }

    return _.assign(token, {
      name: match[1],
      args: match[2],
      trim_left: (result[1].slice(0, 3) === '{%-'),
      trim_right: (result[1].slice(-3) === '-%}'),
      indent: currIndent
    })
  }

  function parseHTMLToken (begin, end) {
    var htmlFragment = html.slice(begin, end)
    currIndent = _.last((htmlFragment || '').split('\n')).length

    return {
      type: 'html',
      raw: htmlFragment,
      value: htmlFragment
    }
  }

  function factory (type, offset, match) {
    return {
      type: type,
      raw: match[offset],
      value: match[offset + 1].trim(),
      line: lineNumber.get(match),
      input: html,
      file: filepath
    }
  }
}

function LineNumber () {
  var parsedLinesCount = 0
  var lastMatchBegin = -1

  return {
    get: function (match) {
      var lines = match.input.slice(lastMatchBegin + 1, match.index).split('\n')
      parsedLinesCount += lines.length - 1
      lastMatchBegin = match.index
      return parsedLinesCount + 1
    }
  }
}

function whiteSpaceCtrl (tokens, options) {
  options = _.assign({ greedy: true }, options)
  var inRaw = false

  tokens.forEach((token, i) => {
    if (!inRaw && (token.trim_left || options.trim_left)) {
      trimLeft(tokens[i - 1], options.greedy)
    }

    if (token.type === 'tag' && token.name === 'raw') inRaw = true
    if (token.type === 'tag' && token.name === 'endraw') inRaw = false

    if (!inRaw && (token.trim_right || options.trim_right)) {
      trimRight(tokens[i + 1], options.greedy)
    }
  })
}

function trimLeft (token, greedy) {
  if (!token || token.type !== 'html') return

  var rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g
  token.value = token.value.replace(rLeft, '')
}

function trimRight (token, greedy) {
  if (!token || token.type !== 'html') return

  var rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g
  token.value = token.value.replace(rRight, '')
}

exports.parse = parse
exports.whiteSpaceCtrl = whiteSpaceCtrl
