import { toArray, argumentsToValue, toValue, stringify, caseInsensitiveCompare, isArray, isNil, last as arrayLast, hasOwnProperty } from '../util'
import { isTruthy } from '../render'
import { FilterImpl } from '../template'
import { Scope } from '../context'
import { isComparable } from '../drop'

export const join = argumentsToValue((v: any[], arg: string) => toArray(v).join(arg === undefined ? ' ' : arg))
export const last = argumentsToValue((v: any) => isArray(v) ? arrayLast(v) : '')
export const first = argumentsToValue((v: any) => isArray(v) ? v[0] : '')
export const reverse = argumentsToValue((v: any[]) => [...toArray(v)].reverse())

export function * sort<T> (this: FilterImpl, arr: T[], property?: string): IterableIterator<unknown> {
  const values: [T, string | number][] = []
  for (const item of toArray(toValue(arr))) {
    values.push([
      item,
      property ? yield this.context._getFromScope(item, stringify(property).split('.')) : item
    ])
  }
  return values.sort((lhs, rhs) => {
    const lvalue = lhs[1]
    const rvalue = rhs[1]
    return lvalue < rvalue ? -1 : (lvalue > rvalue ? 1 : 0)
  }).map(tuple => tuple[0])
}

export function sort_natural<T> (input: T[], property?: string) {
  input = toValue(input)
  const propertyString = stringify(property)
  const compare = property === undefined
    ? caseInsensitiveCompare
    : (lhs: T, rhs: T) => caseInsensitiveCompare(lhs[propertyString], rhs[propertyString])
  return [...toArray(input)].sort(compare)
}

export const size = (v: string | any[]) => (v && v.length) || 0

export function * map (this: FilterImpl, arr: Scope[], property: string): IterableIterator<unknown> {
  const results = []
  for (const item of toArray(toValue(arr))) {
    results.push(yield this.context._getFromScope(item, stringify(property).split('.')))
  }
  return results
}

export function compact<T> (this: FilterImpl, arr: T[]) {
  arr = toValue(arr)
  return toArray(arr).filter(x => !isNil(toValue(x)))
}

export function concat<T1, T2> (v: T1[], arg: T2[] = []): (T1 | T2)[] {
  v = toValue(v)
  arg = toArray(arg).map(v => toValue(v))
  return toArray(v).concat(arg)
}

export function slice<T> (v: T[] | string, begin: number, length = 1): T[] | string {
  v = toValue(v)
  if (isNil(v)) return []
  if (!isArray(v)) v = stringify(v)
  begin = begin < 0 ? v.length + begin : begin
  return v.slice(begin, begin + length)
}

export function * where<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): IterableIterator<unknown> {
  const values: unknown[] = []
  arr = toArray(toValue(arr))
  for (const item of arr) {
    values.push(yield this.context._getFromScope(item, stringify(property).split('.')))
  }
  return arr.filter((_, i) => {
    if (expected === undefined) return isTruthy(values[i], this.context)
    if (isComparable(expected)) return expected.equals(values[i])
    return values[i] === expected
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
