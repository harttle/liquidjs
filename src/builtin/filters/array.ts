import { isArray, last } from '../../util/underscore'
import { isTruthy } from '../../render/boolean'

export default {
  'join': (v: any[], arg: string) => v.join(arg === undefined ? ' ' : arg),
  'last': (v: any) => isArray(v) ? last(v) : '',
  'first': (v: any) => isArray(v) ? v[0] : '',
  'map': map,
  'reverse': (v: any[]) => [...v].reverse(),
  'sort': <T>(v: T[], arg: (lhs: T, rhs: T) => number) => v.sort(arg),
  'size': (v: string | any[]) => (v && v.length) || 0,
  'concat': concat,
  'slice': slice,
  'uniq': uniq,
  'where': where
}

function map<T1, T2> (arr: {[key: string]: T1}[], arg: string): T1[] {
  return arr.map(v => v[arg])
}

function concat<T1, T2> (v: T1[], arg: T2[] | T2): (T1 | T2)[] {
  return Array.prototype.concat.call(v, arg)
}

function slice<T> (v: T[], begin: number, length = 1): T[] {
  begin = begin < 0 ? v.length + begin : begin
  return v.slice(begin, begin + length)
}

function where<T> (arr: T[], property: string, value?: any): T[] {
  return arr.filter(obj => value === undefined ? isTruthy(obj[property]) : obj[property] === value)
}

function uniq<T> (arr: T[]): T[] {
  const u = {}
  return (arr || []).filter(val => {
    if (u.hasOwnProperty(String(val))) return false
    u[String(val)] = true
    return true
  })
}
