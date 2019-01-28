import * as lexical from './lexical.js'
import { TokenizationError } from './util/error.js'
import * as _ from './util/underscore.js'
import assert from './util/assert.js'
import whiteSpaceCtrl from './whitespace-ctrl.js'

export { default as whiteSpaceCtrl } from './whitespace-ctrl.js'

export function parse (input, file, options) {
  assert(_.isString(input), 'illegal input')

  const rLiquid = /({%-?([\s\S]*?)-?%})|({{-?([\s\S]*?)-?}})/g
  let currIndent = 0
  const lineNumber = LineNumber(input)
  let lastMatchEnd = 0
  const tokens = []

  for (let match; (match = rLiquid.exec(input)); lastMatchEnd = rLiquid.lastIndex) {
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
    const match = value.match(lexical.tagLine)
    const token = {
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
    const htmlFragment = input.slice(begin, end)
    currIndent = _.last((htmlFragment).split('\n')).length

    return {
      type: 'html',
      raw: htmlFragment,
      value: htmlFragment
    }
  }
}

function LineNumber (html) {
  let parsedLinesCount = 0
  let lastMatchBegin = -1

  return {
    get: function (pos) {
      const lines = html.slice(lastMatchBegin + 1, pos).split('\n')
      parsedLinesCount += lines.length - 1
      lastMatchBegin = pos
      return parsedLinesCount + 1
    }
  }
}
