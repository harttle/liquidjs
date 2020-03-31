import { isArray, last as arrayLast } from '../../util/underscore'
import { toArray } from '../../util/collection'
import { isTruthy } from '../../render/boolean'
import { FilterImpl } from '../../template/filter/filter-impl'

export const join = (v: any[], arg: string) => v.join(arg === undefined ? ' ' : arg)
export const last = (v: any) => isArray(v) ? arrayLast(v) : ''
export const first = (v: any) => isArray(v) ? v[0] : ''
export const reverse = (v: any[]) => [...v].reverse()
export const sort = <T>(v: T[], arg: (lhs: T, rhs: T) => number) => v.sort(arg)
export const size = (v: string | any[]) => (v && v.length) || 0

export function map<T1, T2> (arr: {[key: string]: T1}[], arg: string): T1[] {
  return toArray(arr).map(v => v[arg])
}

export function concat<T1, T2> (v: T1[], arg: T2[] | T2): (T1 | T2)[] {
  return toArray(v).concat(arg)
}

export function slice<T> (v: T[], begin: number, length = 1): T[] {
  begin = begin < 0 ? v.length + begin : begin
  return v.slice(begin, begin + length)
}

export function where<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): T[] {
  return toArray(arr).filter(obj => {
    const value = this.context.getFromScope(obj, String(property).split('.'))
    return expected === undefined ? isTruthy(value) : value === expected
  })
}

export function uniq<T> (arr: T[]): T[] {
  const u = {}
  return (arr || []).filter(val => {
    if (u.hasOwnProperty(String(val))) return false
    u[String(val)] = true
    return true
  })
}
