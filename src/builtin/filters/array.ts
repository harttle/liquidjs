import { argumentsToValue, toValue, stringify, caseInsensitiveCompare, isArray, isNil, last as arrayLast, hasOwnProperty } from '../../util/underscore'
import { toArray } from '../../util/collection'
import { isTruthy } from '../../render/boolean'
import { FilterImpl } from '../../template/filter/filter-impl'
import { Scope } from '../../context/scope'
import { isComparable } from '../../drop/comparable'

export const join = argumentsToValue((v: any[], arg: string) => toArray(v).join(arg === undefined ? ' ' : arg))
export const last = argumentsToValue((v: any) => isArray(v) ? arrayLast(v) : '')
export const first = argumentsToValue((v: any) => isArray(v) ? v[0] : '')
export const reverse = argumentsToValue((v: any[]) => [...toArray(v)].reverse())

export function sort<T> (this: FilterImpl, arr: T[], property?: string) {
  arr = toValue(arr)
  const getValue = (obj: Scope) => property ? this.context.getFromScope(obj, stringify(property).split('.')) : obj
  return [...toArray(arr)].sort((lhs, rhs) => {
    lhs = getValue(lhs)
    rhs = getValue(rhs)
    return lhs < rhs ? -1 : (lhs > rhs ? 1 : 0)
  })
}

export function sortNatural<T> (input: T[], property?: string) {
  input = toValue(input)
  const propertyString = stringify(property)
  const compare = property === undefined
    ? caseInsensitiveCompare
    : (lhs: T, rhs: T) => caseInsensitiveCompare(lhs[propertyString], rhs[propertyString])
  return [...toArray(input)].sort(compare)
}

export const size = (v: string | any[]) => (v && v.length) || 0

export function map (this: FilterImpl, arr: Scope[], property: string) {
  arr = toValue(arr)
  return toArray(arr).map(obj => this.context.getFromScope(obj, stringify(property).split('.')))
}

export function compact<T> (this: FilterImpl, arr: T[]) {
  arr = toValue(arr)
  return toArray(arr).filter(x => !isNil(toValue(x)))
}

export function concat<T1, T2> (v: T1[], arg: T2[]): (T1 | T2)[] {
  v = toValue(v)
  return toArray(v).concat(arg)
}

export function slice<T> (v: T[] | string, begin: number, length = 1): T[] | string {
  v = toValue(v)
  if (isNil(v)) return []
  if (!isArray(v)) v = stringify(v)
  begin = begin < 0 ? v.length + begin : begin
  return v.slice(begin, begin + length)
}

export function where<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): T[] {
  arr = toValue(arr)
  return toArray(arr).filter(obj => {
    const value = this.context.getFromScope(obj, stringify(property).split('.'))
    if (expected === undefined) return isTruthy(value, this.context)
    if (isComparable(expected)) return expected.equals(value)
    return value === expected
  })
}

export function uniq<T> (arr: T[]): T[] {
  arr = toValue(arr)
  const u = {}
  return (arr || []).filter(val => {
    if (hasOwnProperty.call(u, String(val))) return false
    u[String(val)] = true
    return true
  })
}
