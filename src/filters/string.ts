/**
 * String related filters
 *
 * * prefer stringify() to String() since `undefined`, `null` should eval ''
 */

// Han (Chinese) characters: \u4E00-\u9FFF
// Additional Han characters: \uF900-\uFAFF (CJK Compatibility Ideographs)
// Additional Han characters: \u3400-\u4DBF (CJK Unified Ideographs Extension A)
// Katakana (Japanese): \u30A0-\u30FF
// Hiragana (Japanese): \u3040-\u309F
// Hangul (Korean): \uAC00-\uD7AF
import { FilterImpl } from '../template'
import { advanceCodePoints, assert, codePointLength, stringify, toArray } from '../util'

const rCJKWord = /[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/gu

// Word boundary followed by word characters (for detecting words)
const rNonCJKWord = /[^\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\s]+/gu

export function append (this: FilterImpl, v: string, arg: string) {
  assert(arguments.length === 2, 'append expect 2 arguments')
  const lhs = stringify(v)
  const rhs = stringify(arg)
  this.context.memoryLimit.use(lhs.length + rhs.length)
  return lhs + rhs
}

export function prepend (this: FilterImpl, v: string, arg: string) {
  assert(arguments.length === 2, 'prepend expect 2 arguments')
  const lhs = stringify(v)
  const rhs = stringify(arg)
  this.context.memoryLimit.use(lhs.length + rhs.length)
  return rhs + lhs
}

function getTrimStart (str: string, chars: Set<string>): number {
  let start = 0
  for (const char of str) {
    if (!chars.has(char)) break
    start += char.length
  }
  return start
}

function getTrimEnd (str: string, chars: Set<string>, start = 0): number {
  let end = str.length
  while (end > start) {
    const size = end - start >= 2 && str.codePointAt(end - 2)! > 0xFFFF ? 2 : 1
    if (!chars.has(str.slice(end - size, end))) break
    end -= size
  }
  return end
}

export function lstrip (this: FilterImpl, v: string, chars?: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  if (chars) {
    chars = stringify(chars)
    this.context.memoryLimit.use(chars.length)
    return str.slice(getTrimStart(str, new Set(chars)))
  }
  return str.trimStart()
}

export function downcase (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  return str.toLowerCase()
}

export function upcase (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  return stringify(str).toUpperCase()
}

export function remove (this: FilterImpl, v: string, arg: string) {
  const str = stringify(v)
  arg = stringify(arg)
  this.context.memoryLimit.use(str.length + arg.length)
  return str.split(arg).join('')
}

export function remove_first (this: FilterImpl, v: string, l: string) {
  const str = stringify(v)
  l = stringify(l)
  this.context.memoryLimit.use(str.length + l.length)
  return str.replace(l, '')
}

export function remove_last (this: FilterImpl, v: string, l: string) {
  const str = stringify(v)
  const pattern = stringify(l)
  this.context.memoryLimit.use(str.length + pattern.length)
  const index = str.lastIndexOf(pattern)
  if (index === -1) return str
  return str.substring(0, index) + str.substring(index + pattern.length)
}

export function rstrip (this: FilterImpl, str: string, chars?: string) {
  str = stringify(str)
  this.context.memoryLimit.use(str.length)
  if (chars) {
    chars = stringify(chars)
    this.context.memoryLimit.use(chars.length)
    return str.slice(0, getTrimEnd(str, new Set(chars)))
  }
  return str.trimEnd()
}

export function split (this: FilterImpl, v: string, arg: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  const sep = stringify(arg)
  // align to ruby split, which is the behavior of shopify/liquid
  // see: https://ruby-doc.org/core-2.4.0/String.html#method-i-split
  // a single space splits on runs of ASCII whitespace and ignores leading whitespace
  if (sep === ' ') {
    const trimmed = str.replace(/^[ \t\n\v\f\r]+|[ \t\n\v\f\r]+$/g, '')
    return trimmed === '' ? [] : trimmed.split(/[ \t\n\v\f\r]+/)
  }
  // an empty separator splits by code point, so astral characters stay whole
  const arr = sep === '' ? Array.from(str) : str.split(sep)
  while (arr.length && arr[arr.length - 1] === '') arr.pop()
  return arr
}

export function strip (this: FilterImpl, v: string, chars?: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  if (chars) {
    const set = new Set(stringify(chars))
    this.context.memoryLimit.use(set.size)
    const start = getTrimStart(str, set)
    return str.slice(start, getTrimEnd(str, set, start))
  }
  return str.trim()
}

export function strip_newlines (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  return str.replace(/\r?\n/gm, '')
}

export function squish (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  return str.replace(/\s+/g, ' ').trim()
}

export function capitalize (this: FilterImpl, str: string) {
  str = stringify(str)
  this.context.memoryLimit.use(str.length)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function replace (this: FilterImpl, v: string, pattern: string, replacement: string) {
  const str = stringify(v)
  pattern = stringify(pattern)
  replacement = stringify(replacement)
  const parts = str.split(pattern)
  const outputSize = str.length + (parts.length - 1) * (replacement.length - pattern.length)
  this.context.memoryLimit.use(outputSize)
  return parts.join(replacement)
}

export function replace_first (this: FilterImpl, v: string, arg1: string, arg2: string) {
  const str = stringify(v)
  arg1 = stringify(arg1)
  arg2 = stringify(arg2)
  this.context.memoryLimit.use(str.length + arg1.length + arg2.length)
  return str.replace(arg1, () => arg2)
}

export function replace_last (this: FilterImpl, v: string, arg1: string, arg2: string) {
  const str = stringify(v)
  const pattern = stringify(arg1)
  const replacement = stringify(arg2)
  this.context.memoryLimit.use(str.length + pattern.length + replacement.length)
  const index = str.lastIndexOf(pattern)
  if (index === -1) return str
  return str.substring(0, index) + replacement + str.substring(index + pattern.length)
}

export function truncate (this: FilterImpl, v: string, l = 50, o = '...') {
  const str = stringify(v)
  o = stringify(o)
  this.context.memoryLimit.use(str.length + o.length)
  if (str.length <= l || advanceCodePoints(str, 0, l) >= str.length) return v
  return str.slice(0, advanceCodePoints(str, 0, Math.max(l - codePointLength(o), 0))) + o
}

export function truncatewords (this: FilterImpl, v: string, words = 15, o = '...') {
  const str = stringify(v)
  o = stringify(o)
  this.context.memoryLimit.use(str.length + o.length)
  if (words <= 0) words = 1
  const limit = Math.floor(words)
  const rWord = /\S+/g
  const kept: string[] = []
  let match: RegExpExecArray | null
  while (kept.length < limit && (match = rWord.exec(str))) kept.push(match[0])
  if (kept.length < limit || rWord.lastIndex >= str.length) return str
  return kept.join(' ') + o
}

export function normalize_whitespace (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  return str.replace(/\s+/g, ' ')
}

export function number_of_words (this: FilterImpl, input: string, mode?: 'cjk' | 'auto') {
  const str = stringify(input)
  this.context.memoryLimit.use(str.length)
  input = str.trim()
  if (!input) return 0
  switch (mode) {
    case 'cjk':
      // Count CJK characters and words
      return (input.match(rCJKWord) || []).length + (input.match(rNonCJKWord) || []).length
    case 'auto':
      // Count CJK characters, if none, count words
      return rCJKWord.test(input)
        ? input.match(rCJKWord)!.length + (input.match(rNonCJKWord) || []).length
        : input.split(/\s+/).length
    default:
      // Count words only
      return input.split(/\s+/).length
  }
}

export function array_to_sentence_string (this: FilterImpl, input: unknown, connector = 'and') {
  const array = toArray(input)
  connector = stringify(connector)
  let outputSize = connector.length + array.length * 2
  for (let i = 0; i < array.length; i++) outputSize += stringify(array[i]).length
  this.context.memoryLimit.use(outputSize)
  switch (array.length) {
    case 0:
      return ''
    case 1:
      return array[0]
    case 2:
      return `${array[0]} ${connector} ${array[1]}`
    default:
      return `${array.slice(0, -1).join(', ')}, ${connector} ${array[array.length - 1]}`
  }
}
