/**
 * String related filters
 *
 * * prefer stringify() to String() since `undefined`, `null` should eval ''
 */
import { stringify } from '../../util/underscore'

export default {
  'append': (v: string, arg: string) => stringify(v) + arg,
  'prepend': (v: string, arg: string) => arg + stringify(v),
  'capitalize': capitalize,
  'lstrip': (v: string) => stringify(v).replace(/^\s+/, ''),
  'downcase': (v: string) => stringify(v).toLowerCase(),
  'upcase': (str: string) => stringify(str).toUpperCase(),
  'remove': (v: string, arg: string) => stringify(v).split(arg).join(''),
  'remove_first': (v: string, l: string) => stringify(v).replace(l, ''),
  'replace': replace,
  'replace_first': replaceFirst,
  'rstrip': (str: string) => stringify(str).replace(/\s+$/, ''),
  'split': (v: string, arg: string) => stringify(v).split(arg),
  'strip': (v: string) => stringify(v).trim(),
  'strip_newlines': (v: string) => stringify(v).replace(/\n/g, ''),
  'truncate': truncate,
  'truncatewords': truncateWords
}

function capitalize (str: string) {
  str = stringify(str)
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function replace (v: string, pattern: string, replacement: string) {
  return stringify(v).split(pattern).join(replacement)
}

function replaceFirst (v: string, arg1: string, arg2: string) {
  return stringify(v).replace(arg1, arg2)
}

function truncate (v: string, l: number = 50, o: string = '...') {
  v = stringify(v)
  if (v.length <= l) return v
  return v.substr(0, l - o.length) + o
}

function truncateWords (v: string, l: number = 15, o: string = '...') {
  const arr = v.split(/\s+/)
  let ret = arr.slice(0, l).join(' ')
  if (arr.length >= l) ret += o
  return ret
}
