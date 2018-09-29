// quote related
const singleQuoted = /'[^']*'/
const doubleQuoted = /"[^"]*"/
export const quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`)
export const quoteBalanced = new RegExp(`(?:${quoted.source}|[^'"])*`)

// basic types
export const integer = /-?\d+/
export const number = /-?\d+\.?\d*|\.?\d+/
export const bool = /true|false/

// property access
export const identifier = /[\w-]+[?]?/
export const subscript = new RegExp(`\\[(?:${quoted.source}|[\\w-\\.]+)\\]`)
export const literal = new RegExp(`(?:${quoted.source}|${bool.source}|${number.source})`)
export const variable = new RegExp(`${identifier.source}(?:\\.${identifier.source}|${subscript.source})*`)

// range related
export const rangeLimit = new RegExp(`(?:${variable.source}|${number.source})`)
export const range = new RegExp(`\\(${rangeLimit.source}\\.\\.${rangeLimit.source}\\)`)
export const rangeCapture = new RegExp(`\\((${rangeLimit.source})\\.\\.(${rangeLimit.source})\\)`)

export const value = new RegExp(`(?:${variable.source}|${literal.source}|${range.source})`)

// hash related
export const hash = new RegExp(`(?:${identifier.source})\\s*:\\s*(?:${value.source})`)
export const hashCapture = new RegExp(`(${identifier.source})\\s*:\\s*(${value.source})`, 'g')

// full match
export const tagLine = new RegExp(`^\\s*(${identifier.source})\\s*([\\s\\S]*)\\s*$`)
export const literalLine = new RegExp(`^${literal.source}$`, 'i')
export const variableLine = new RegExp(`^${variable.source}$`)
export const numberLine = new RegExp(`^${number.source}$`)
export const boolLine = new RegExp(`^${bool.source}$`, 'i')
export const quotedLine = new RegExp(`^${quoted.source}$`)
export const rangeLine = new RegExp(`^${rangeCapture.source}$`)
export const integerLine = new RegExp(`^${integer.source}$`)

// filter related
export const valueDeclaration = new RegExp(`(?:${identifier.source}\\s*:\\s*)?${value.source}`)
export const valueList = new RegExp(`${valueDeclaration.source}(\\s*,\\s*${valueDeclaration.source})*`)
export const filter = new RegExp(`${identifier.source}(?:\\s*:\\s*${valueList.source})?`, 'g')
export const filterCapture = new RegExp(`(${identifier.source})(?:\\s*:\\s*(${valueList.source}))?`)
export const filterLine = new RegExp(`^${filterCapture.source}$`)

export const operators = [
  /\s+or\s+/,
  /\s+and\s+/,
  /==|!=|<=|>=|<|>|\s+contains\s+/
]

export function isInteger (str) {
  return integerLine.test(str)
}

export function isLiteral (str) {
  return literalLine.test(str)
}

export function isRange (str) {
  return rangeLine.test(str)
}

export function isVariable (str) {
  return variableLine.test(str)
}

export function matchValue (str) {
  return value.exec(str)
}

export function parseLiteral (str) {
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
