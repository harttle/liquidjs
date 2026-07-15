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
import { assert, stringify } from '../util'

const rCJKWord = /[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/gu

// Word boundary followed by word characters (for detecting words)
const rNonCJKWord = /[^\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\s]+/gu

export function append (this: FilterImpl, v: string, arg: string) {
  assert(arguments.length === 2, 'append expect 2 arguments')
  const lhs = stringify(v)
  const rhs = stringify(arg)
  return lhs + rhs
}

export function prepend (this: FilterImpl, v: string, arg: string) {
  assert(arguments.length === 2, 'prepend expect 2 arguments')
  const lhs = stringify(v)
  const rhs = stringify(arg)
  return rhs + lhs
}

export function lstrip (this: FilterImpl, v: string, chars?: string) {
  const str = stringify(v)
  if (chars) {
    chars = stringify(chars)
    for (let i = 0, set = new Set(chars); i < str.length; i++) {
      if (!set.has(str[i])) return str.slice(i)
    }
    return ''
  }
  return str.trimStart()
}

export function downcase (this: FilterImpl, v: string) {
  const str = stringify(v)
  return str.toLowerCase()
}

export function upcase (this: FilterImpl, v: string) {
  const str = stringify(v)
  return stringify(str).toUpperCase()
}

export function remove (this: FilterImpl, v: string, arg: string) {
  const str = stringify(v)
  arg = stringify(arg)
  return str.split(arg).join('')
}

export function remove_first (this: FilterImpl, v: string, l: string) {
  const str = stringify(v)
  l = stringify(l)
  return str.replace(l, '')
}

export function remove_last (this: FilterImpl, v: string, l: string) {
  const str = stringify(v)
  const pattern = stringify(l)
  const index = str.lastIndexOf(pattern)
  if (index === -1) return str
  return str.substring(0, index) + str.substring(index + pattern.length)
}

export function rstrip (this: FilterImpl, str: string, chars?: string) {
  str = stringify(str)
  if (chars) {
    chars = stringify(chars)
    for (let i = str.length - 1, set = new Set(chars); i >= 0; i--) {
      if (!set.has(str[i])) return str.slice(0, i + 1)
    }
    return ''
  }
  return str.trimEnd()
}

export function split (this: FilterImpl, v: string, arg: string) {
  const str = stringify(v)
  const arr = str.split(stringify(arg))
  // align to ruby split, which is the behavior of shopify/liquid
  // see: https://ruby-doc.org/core-2.4.0/String.html#method-i-split
  while (arr.length && arr[arr.length - 1] === '') arr.pop()
  return arr
}

export function strip (this: FilterImpl, v: string, chars?: string) {
  const str = stringify(v)
  if (chars) {
    const set = new Set(stringify(chars))
    let i = 0
    let j = str.length - 1
    while (set.has(str[i])) i++
    while (j >= i && set.has(str[j])) j--
    return str.slice(i, j + 1)
  }
  return str.trim()
}

export function strip_newlines (this: FilterImpl, v: string) {
  const str = stringify(v)
  return str.replace(/\r?\n/gm, '')
}

export function capitalize (this: FilterImpl, str: string) {
  str = stringify(str)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function replace (this: FilterImpl, v: string, pattern: string, replacement: string) {
  const str = stringify(v)
  pattern = stringify(pattern)
  replacement = stringify(replacement)
  const parts = str.split(pattern)
  return parts.join(replacement)
}

export function replace_first (this: FilterImpl, v: string, arg1: string, arg2: string) {
  const str = stringify(v)
  arg1 = stringify(arg1)
  arg2 = stringify(arg2)
  return str.replace(arg1, () => arg2)
}

export function replace_last (this: FilterImpl, v: string, arg1: string, arg2: string) {
  const str = stringify(v)
  const pattern = stringify(arg1)
  const replacement = stringify(arg2)
  const index = str.lastIndexOf(pattern)
  if (index === -1) return str
  return str.substring(0, index) + replacement + str.substring(index + pattern.length)
}

export function truncate (this: FilterImpl, v: string, l = 50, o = '...') {
  const str = stringify(v)
  o = stringify(o)
  if (str.length <= l) return v
  return str.substring(0, l - o.length) + o
}

export function truncatewords (this: FilterImpl, v: string, words = 15, o = '...') {
  const str = stringify(v)
  o = stringify(o)
  const arr = str.split(/\s+/)
  if (words <= 0) words = 1
  let ret = arr.slice(0, words).join(' ')
  if (arr.length >= words) ret += o
  return ret
}

export function normalize_whitespace (this: FilterImpl, v: string) {
  const str = stringify(v)
  return str.replace(/\s+/g, ' ')
}

export function number_of_words (this: FilterImpl, input: string, mode?: 'cjk' | 'auto') {
  const str = stringify(input)
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

export function array_to_sentence_string (this: FilterImpl, array: unknown[], connector = 'and') {
  connector = stringify(connector)
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
