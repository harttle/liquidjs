const lexical = require('./lexical.js')
const TokenizationError = require('./util/error.js').TokenizationError
const _ = require('./util/underscore.js')
const whiteSpaceCtrl = require('./whitespace-ctrl.js')
const assert = require('./util/assert.js')

function parse (input, file, options) {
  assert(_.isString(input), 'illegal input')

  var rLiquid = /({%-?([\s\S]*?)-?%})|({{-?([\s\S]*?)-?}})/g
  var currIndent = 0
  var lineNumber = LineNumber(input)
  var lastMatchEnd = 0
  var tokens = []

  for (var match; (match = rLiquid.exec(input)); lastMatchEnd = rLiquid.lastIndex) {
    if (match.index > lastMatchEnd) {
      tokens.push(parseHTMLToken(lastMatchEnd, match.index))
    }
    tokens.push(match[1]
      ? parseTagToken(match[1], match[2].trim(), match.index)
      : parseValueToken(match[3], match[4].trim(), match.index))
  }
  if (input.length > lastMatchEnd) {
    tokens.push(parseHTMLToken(lastMatchEnd, input.length))
  }
  whiteSpaceCtrl(tokens, options)
  return tokens

  function parseTagToken (raw, value, pos) {
    var match = value.match(lexical.tagLine)
    var token = {
      type: 'tag',
      indent: currIndent,
      line: lineNumber.get(pos),
      trim_left: raw.slice(0, 3) === '{%-',
      trim_right: raw.slice(-3) === '-%}',
      raw,
      value,
      input,
      file
    }
    if (!match) {
      throw new TokenizationError(`illegal tag syntax`, token)
    }
    token.name = match[1]
    token.args = match[2]
    return token
  }

  function parseValueToken (raw, value, pos) {
    return {
      type: 'value',
      line: lineNumber.get(pos),
      trim_left: raw.slice(0, 3) === '{{-',
      trim_right: raw.slice(-3) === '-}}',
      raw,
      value,
      input,
      file
    }
  }

  function parseHTMLToken (begin, end) {
    var htmlFragment = input.slice(begin, end)
    currIndent = _.last((htmlFragment).split('\n')).length

    return {
      type: 'html',
      raw: htmlFragment,
      value: htmlFragment
    }
  }
}

function LineNumber (html) {
  var parsedLinesCount = 0
  var lastMatchBegin = -1

  return {
    get: function (pos) {
      var lines = html.slice(lastMatchBegin + 1, pos).split('\n')
      parsedLinesCount += lines.length - 1
      lastMatchBegin = pos
      return parsedLinesCount + 1
    }
  }
}

exports.parse = parse
exports.whiteSpaceCtrl = whiteSpaceCtrl
