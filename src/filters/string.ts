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
import { assert, escapeRegExp, stringify } from '../util'

const rCJKWord = /[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/gu

// Word boundary followed by word characters (for detecting words)
const rNonCJKWord = /[^\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\s]+/gu

export function append (v: string, arg: string) {
  assert(arguments.length === 2, 'append expect 2 arguments')
  return stringify(v) + stringify(arg)
}

export function prepend (v: string, arg: string) {
  assert(arguments.length === 2, 'prepend expect 2 arguments')
  return stringify(arg) + stringify(v)
}

export function lstrip (v: string, chars?: string) {
  if (chars) {
    chars = escapeRegExp(stringify(chars))
    return stringify(v).replace(new RegExp(`^[${chars}]+`, 'g'), '')
  }
  return stringify(v).replace(/^\s+/, '')
}

export function downcase (v: string) {
  return stringify(v).toLowerCase()
}

export function upcase (str: string) {
  return stringify(str).toUpperCase()
}

export function remove (v: string, arg: string) {
  return stringify(v).split(stringify(arg)).join('')
}

export function remove_first (v: string, l: string) {
  return stringify(v).replace(stringify(l), '')
}

export function remove_last (v: string, l: string) {
  const str = stringify(v)
  const pattern = stringify(l)
  const index = str.lastIndexOf(pattern)
  if (index === -1) return str
  return str.substring(0, index) + str.substring(index + pattern.length)
}

export function rstrip (str: string, chars?: string) {
  if (chars) {
    chars = escapeRegExp(stringify(chars))
    return stringify(str).replace(new RegExp(`[${chars}]+$`, 'g'), '')
  }
  return stringify(str).replace(/\s+$/, '')
}

export function split (v: string, arg: string) {
  const arr = stringify(v).split(stringify(arg))
  // align to ruby split, which is the behavior of shopify/liquid
  // see: https://ruby-doc.org/core-2.4.0/String.html#method-i-split
  while (arr.length && arr[arr.length - 1] === '') arr.pop()
  return arr
}

export function strip (v: string, chars?: string) {
  if (chars) {
    chars = escapeRegExp(stringify(chars))
    return stringify(v)
      .replace(new RegExp(`^[${chars}]+`, 'g'), '')
      .replace(new RegExp(`[${chars}]+$`, 'g'), '')
  }
  return stringify(v).trim()
}

export function strip_newlines (v: string) {
  return stringify(v).replace(/\r?\n/gm, '')
}

export function capitalize (str: string) {
  str = stringify(str)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function replace (v: string, pattern: string, replacement: string) {
  return stringify(v).split(stringify(pattern)).join(replacement)
}

export function replace_first (v: string, arg1: string, arg2: string) {
  return stringify(v).replace(stringify(arg1), arg2)
}

export function replace_last (v: string, arg1: string, arg2: string) {
  const str = stringify(v)
  const pattern = stringify(arg1)
  const index = str.lastIndexOf(pattern)
  if (index === -1) return str
  const replacement = stringify(arg2)
  return str.substring(0, index) + replacement + str.substring(index + pattern.length)
}

export function truncate (v: string, l = 50, o = '...') {
  v = stringify(v)
  if (v.length <= l) return v
  return v.substring(0, l - o.length) + o
}

export function truncatewords (v: string, words = 15, o = '...') {
  const arr = stringify(v).split(/\s+/)
  if (words <= 0) words = 1
  let ret = arr.slice(0, words).join(' ')
  if (arr.length >= words) ret += o
  return ret
}

export function normalize_whitespace (v: string) {
  v = stringify(v)
  return v.replace(/\s+/g, ' ')
}

export function number_of_words (input: string, mode?: 'cjk' | 'auto') {
  input = stringify(input).trim()
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

export function array_to_sentence_string (array: unknown[], connector = 'and') {
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
