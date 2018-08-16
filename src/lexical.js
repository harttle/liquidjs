// quote related
let singleQuoted = /'[^']*'/
let doubleQuoted = /"[^"]*"/
let quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`)
let quoteBalanced = new RegExp(`(?:${quoted.source}|[^'"])*`)

// basic types
let integer = /-?\d+/
let number = /-?\d+\.?\d*|\.?\d+/
let bool = /true|false/

// peoperty access
let identifier = /[\w-]+[?]?/
let subscript = new RegExp(`\\[(?:${quoted.source}|[\\w-\\.]+)\\]`)
let literal = new RegExp(`(?:${quoted.source}|${bool.source}|${number.source})`)
let variable = new RegExp(`${identifier.source}(?:\\.${identifier.source}|${subscript.source})*`)

// range related
let rangeLimit = new RegExp(`(?:${variable.source}|${number.source})`)
let range = new RegExp(`\\(${rangeLimit.source}\\.\\.${rangeLimit.source}\\)`)
let rangeCapture = new RegExp(`\\((${rangeLimit.source})\\.\\.(${rangeLimit.source})\\)`)

let value = new RegExp(`(?:${variable.source}|${literal.source}|${range.source})`)

// hash related
let hash = new RegExp(`(?:${identifier.source})\\s*:\\s*(?:${value.source})`)
let hashCapture = new RegExp(`(${identifier.source})\\s*:\\s*(${value.source})`, 'g')

// full match
let tagLine = new RegExp(`^\\s*(${identifier.source})\\s*([\\s\\S]*)\\s*$`)
let literalLine = new RegExp(`^${literal.source}$`, 'i')
let variableLine = new RegExp(`^${variable.source}$`)
let numberLine = new RegExp(`^${number.source}$`)
let boolLine = new RegExp(`^${bool.source}$`, 'i')
let quotedLine = new RegExp(`^${quoted.source}$`)
let rangeLine = new RegExp(`^${rangeCapture.source}$`)
let integerLine = new RegExp(`^${integer.source}$`)

// filter related
let valueDeclaration = new RegExp(`(?:${identifier.source}\\s*:\\s*)?${value.source}`)
let valueList = new RegExp(`${valueDeclaration.source}(\\s*,\\s*${valueDeclaration.source})*`)
let filter = new RegExp(`${identifier.source}(?:\\s*:\\s*${valueList.source})?`, 'g')
let filterCapture = new RegExp(`(${identifier.source})(?:\\s*:\\s*(${valueList.source}))?`)
let filterLine = new RegExp(`^${filterCapture.source}$`)

let operators = [
  /\s+or\s+/,
  /\s+and\s+/,
  /==|!=|<=|>=|<|>|\s+contains\s+/
]

function isInteger (str) {
  return integerLine.test(str)
}

function isLiteral (str) {
  return literalLine.test(str)
}

function isRange (str) {
  return rangeLine.test(str)
}

function isVariable (str) {
  return variableLine.test(str)
}

function matchValue (str) {
  return value.exec(str)
}

function parseLiteral (str) {
  let res = str.match(numberLine)
  if (res) {
    return Number(str)
  }
  res = str.match(boolLine)
  if (res) {
    return str.toLowerCase() === 'true'
  }
  res = str.match(quotedLine)
  if (res) {
    return str.slice(1, -1)
  }
  throw new TypeError(`cannot parse '${str}' as literal`)
}

module.exports = {
  quoted,
  number,
  bool,
  literal,
  filter,
  integer,
  hash,
  hashCapture,
  range,
  rangeCapture,
  identifier,
  value,
  quoteBalanced,
  operators,
  quotedLine,
  numberLine,
  boolLine,
  rangeLine,
  literalLine,
  filterLine,
  tagLine,
  isLiteral,
  isVariable,
  parseLiteral,
  isRange,
  matchValue,
  isInteger
}
