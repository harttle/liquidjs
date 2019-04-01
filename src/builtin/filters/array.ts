import { last } from '../../util/underscore'
import { isTruthy } from '../../render/syntax'

export default {
  'join': (v: any[], arg: string) => v.join(arg === undefined ? ' ' : arg),
  'last': <T>(v: T[]): T => last(v),
  'first': <T>(v: T[]): T => v[0],
  'map': <T1, T2>(arr: {[key: string]: T1}[], arg: string): T1[] => arr.map(v => v[arg]),
  'reverse': (v: any[]) => v.reverse(),
  'sort': <T>(v: T[], arg: (lhs: T, rhs: T) => number) => v.sort(arg),
  'size': (v: string | any[]) => v.length,
  'concat': <T1, T2>(v: T1[], arg: T2[] | T2): Array<T1 | T2> => Array.prototype.concat.call(v, arg),
  'slice': <T>(v: T[], begin: number, length: number = 1): T[] => {
    begin = begin < 0 ? v.length + begin : begin
    return v.slice(begin, begin + length)
  },
  'uniq': function<T> (arr: T[]): T[] {
    const u = {}
    return (arr || []).filter(val => {
      if (u.hasOwnProperty(String(val))) return false
      u[String(val)] = true
      return true
    })
  },
  'where': function<T> (arr: T[], property: string, value?: any): T[] {
    return arr.filter(obj => value === undefined ? isTruthy(obj[property]) : obj[property] === value)
  }
}
