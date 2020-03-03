// quote related
const singleQuoted = /'[^']*'/
const doubleQuoted = /"[^"]*"/
export const quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`)
export const quoteBalanced = new RegExp(`(?:${quoted.source}|[^'"])*`)

// basic types
export const number = /[+-]?(?:\d+\.?\d*|\.?\d+)/
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

// full match
export const tagLine = new RegExp(`^\\s*(${identifier.source})\\s*([\\s\\S]*?)\\s*$`)
export const numberLine = new RegExp(`^${number.source}$`)
export const boolLine = new RegExp(`^${bool.source}$`, 'i')
export const quotedLine = new RegExp(`^${quoted.source}$`)
export const rangeLine = new RegExp(`^${rangeCapture.source}$`)
