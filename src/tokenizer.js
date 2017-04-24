const lexical = require('./lexical.js')
const TokenizationError = require('./util/error.js').TokenizationError
const _ = require('./util/underscore.js')
const assert = require('../src/util/assert.js')

function parse (html, filepath, options) {
  assert(_.isString(html), 'illegal input type')

  html = whiteSpaceCtrl(html, options)

  var tokens = []
  var syntax = /({%-?([\s\S]*?)-?%})|({{([\s\S]*?)}})/g
  var result, htmlFragment, token
  var lastMatchEnd = 0
  var lastMatchBegin = -1
  var parsedLinesCount = 0

  while ((result = syntax.exec(html)) !== null) {
        // passed html fragments
    if (result.index > lastMatchEnd) {
      htmlFragment = html.slice(lastMatchEnd, result.index)
      tokens.push({
        type: 'html',
        raw: htmlFragment,
        value: htmlFragment
      })
    }
    if (result[1]) {
      // tag appeared
      token = factory('tag', 1, result)

      var match = token.value.match(lexical.tagLine)
      if (!match) {
        throw new TokenizationError(`illegal tag syntax`, token)
      }
      token.name = match[1]
      token.args = match[2]

      tokens.push(token)
    } else {
      // output
      token = factory('output', 3, result)
      tokens.push(token)
    }
    lastMatchEnd = syntax.lastIndex
  }

    // remaining html
  if (html.length > lastMatchEnd) {
    htmlFragment = html.slice(lastMatchEnd, html.length)
    tokens.push({
      type: 'html',
      raw: htmlFragment,
      value: htmlFragment
    })
  }
  return tokens

  function factory (type, offset, match) {
    return {
      type: type,
      raw: match[offset],
      value: match[offset + 1].trim(),
      line: getLineNum(match),
      input: html,
      file: filepath
    }
  }

  function getLineNum (match) {
    var lines = match.input.slice(lastMatchBegin + 1, match.index).split('\n')
    parsedLinesCount += lines.length - 1
    lastMatchBegin = match.index
    return parsedLinesCount + 1
  }
}

function whiteSpaceCtrl (html, options) {
  options = options || {}
  if (options.trim_left) {
    html = html.replace(/{%-?/g, '{%-')
  }
  if (options.trim_right) {
    html = html.replace(/-?%}/g, '-%}')
  }
  var rLeft = options.greedy ? /\s+({%-)/g : /[\t\r ]*({%-)/g
  var rRight = options.greedy ? /(-%})\s+/g : /(-%})[\t\r ]*\n?/g
  return html.replace(rLeft, '$1').replace(rRight, '$1')
}

exports.parse = parse
exports.whiteSpaceCtrl = whiteSpaceCtrl
