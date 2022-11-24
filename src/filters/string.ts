/**
 * String related filters
 *
 * * prefer stringify() to String() since `undefined`, `null` should eval ''
 */
import { assert, escapeRegExp, stringify } from '../util'

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
  return stringify(v).split(String(arg)).join('')
}

export function remove_first (v: string, l: string) {
  return stringify(v).replace(String(l), '')
}

export function rstrip (str: string, chars?: string) {
  if (chars) {
    chars = escapeRegExp(stringify(chars))
    return stringify(str).replace(new RegExp(`[${chars}]+$`, 'g'), '')
  }
  return stringify(str).replace(/\s+$/, '')
}

export function split (v: string, arg: string) {
  const arr = stringify(v).split(String(arg))
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
  return stringify(v).replace(/\n/g, '')
}

export function capitalize (str: string) {
  str = stringify(str)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function replace (v: string, pattern: string, replacement: string) {
  return stringify(v).split(String(pattern)).join(replacement)
}

export function replace_first (v: string, arg1: string, arg2: string) {
  return stringify(v).replace(String(arg1), arg2)
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
