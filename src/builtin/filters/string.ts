/**
 * String related filters
 *
 * * prefer stringify() to String() since `undefined`, `null` should eval ''
 */
import { stringify } from '../../util/underscore'
import { assert } from '../../util/assert'

export function append (v: string, arg: string) {
  assert(arguments.length === 2, 'append expect 2 arguments')
  return stringify(v) + stringify(arg)
}

export function prepend (v: string, arg: string) {
  assert(arguments.length === 2, 'prepend expect 2 arguments')
  return stringify(arg) + stringify(v)
}

export function lstrip (v: string) {
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

export function removeFirst (v: string, l: string) {
  return stringify(v).replace(String(l), '')
}

export function rstrip (str: string) {
  return stringify(str).replace(/\s+$/, '')
}

export function split (v: string, arg: string) {
  return stringify(v).split(String(arg))
}

export function strip (v: string) {
  return stringify(v).trim()
}

export function stripNewlines (v: string) {
  return stringify(v).replace(/\n/g, '')
}

export function capitalize (str: string) {
  str = stringify(str)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function replace (v: string, pattern: string, replacement: string) {
  return stringify(v).split(String(pattern)).join(replacement)
}

export function replaceFirst (v: string, arg1: string, arg2: string) {
  return stringify(v).replace(String(arg1), arg2)
}

export function truncate (v: string, l = 50, o = '...') {
  v = stringify(v)
  if (v.length <= l) return v
  return v.substr(0, l - o.length) + o
}

export function truncatewords (v: string, l = 15, o = '...') {
  const arr = v.split(/\s+/)
  let ret = arr.slice(0, l).join(' ')
  if (arr.length >= l) ret += o
  return ret
}
