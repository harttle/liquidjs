import { toArray, argumentsToValue, toValue, stringify, caseInsensitiveCompare, isArray, isNil, last as arrayLast, hasOwnProperty } from '../util'
import { equals, evalToken, isTruthy } from '../render'
import { Value, FilterImpl } from '../template'
import { Context, Scope } from '../context'
import { Tokenizer } from '../parser'

export const join = argumentsToValue((v: any[], arg: string) => toArray(v).join(arg === undefined ? ' ' : arg))
export const last = argumentsToValue((v: any) => isArray(v) ? arrayLast(v) : '')
export const first = argumentsToValue((v: any) => isArray(v) ? v[0] : '')
export const reverse = argumentsToValue((v: any[]) => [...toArray(v)].reverse())

export function * sort<T> (this: FilterImpl, arr: T[], property?: string): IterableIterator<unknown> {
  const values: [T, string | number][] = []
  for (const item of toArray(arr)) {
    values.push([
      item,
      property ? yield this.context._getFromScope(item, stringify(property).split('.'), false) : item
    ])
  }
  return values.sort((lhs, rhs) => {
    const lvalue = lhs[1]
    const rvalue = rhs[1]
    return lvalue < rvalue ? -1 : (lvalue > rvalue ? 1 : 0)
  }).map(tuple => tuple[0])
}

export function sort_natural<T> (input: T[], property?: string) {
  const propertyString = stringify(property)
  const compare = property === undefined
    ? caseInsensitiveCompare
    : (lhs: T, rhs: T) => caseInsensitiveCompare(lhs[propertyString], rhs[propertyString])
  return [...toArray(input)].sort(compare)
}

export const size = (v: string | any[]) => (v && v.length) || 0

export function * map (this: FilterImpl, arr: Scope[], property: string): IterableIterator<unknown> {
  const results = []
  for (const item of toArray(arr)) {
    results.push(yield this.context._getFromScope(item, stringify(property), false))
  }
  return results
}

export function * sum (this: FilterImpl, arr: Scope[], property?: string): IterableIterator<unknown> {
  let sum = 0
  for (const item of toArray(arr)) {
    const data = Number(property ? yield this.context._getFromScope(item, stringify(property), false) : item)
    sum += Number.isNaN(data) ? 0 : data
  }
  return sum
}

export function compact<T> (this: FilterImpl, arr: T[]) {
  return toArray(arr).filter(x => !isNil(toValue(x)))
}

export function concat<T1, T2> (v: T1[], arg: T2[] = []): (T1 | T2)[] {
  return toArray(v).concat(toArray(arg))
}

export function push<T> (v: T[], arg: T): T[] {
  return concat(v, [arg])
}

export function unshift<T> (v: T[], arg: T): T[] {
  const clone = [...toArray(v)]
  clone.unshift(arg)
  return clone
}

export function pop<T> (v: T[]): T[] {
  const clone = [...toArray(v)]
  clone.pop()
  return clone
}

export function shift<T> (v: T[]): T[] {
  const clone = [...toArray(v)]
  clone.shift()
  return clone
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
  arr = toArray(arr)
  const token = new Tokenizer(stringify(property)).readScopeValue()
  for (const item of arr) {
    values.push(yield evalToken(token, new Context(item)))
  }
  return arr.filter((_, i) => {
    if (expected === undefined) return isTruthy(values[i], this.context)
    return equals(values[i], expected)
  })
}

export function * group_by<T extends object> (arr: T[], property: string): IterableIterator<unknown> {
  const map = new Map()
  arr = toArray(arr)
  const token = new Tokenizer(stringify(property)).readScopeValue()
  for (const item of arr) {
    const key = yield evalToken(token, new Context(item))
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }))
}

export function * group_by_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const map = new Map()
  const keyTemplate = new Value(stringify(exp), this.liquid)
  for (const item of toArray(arr)) {
    const key = yield keyTemplate.value(new Context({ [itemName]: item }))
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }))
}

export function * find<T extends object> (this: FilterImpl, arr: T[], property: string, expected: string): IterableIterator<unknown> {
  const token = new Tokenizer(stringify(property)).readScopeValue()
  for (const item of toArray(arr)) {
    const value = yield evalToken(token, new Context(item))
    if (equals(value, expected)) return item
  }
  return null
}

export function * find_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const predicate = new Value(stringify(exp), this.liquid)
  for (const item of toArray(arr)) {
    const value = yield predicate.value(new Context({ [itemName]: item }))
    if (value) return item
  }
  return null
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

export function sample<T> (v: T[] | string, count = 1): T | string | (T | string)[] {
  v = toValue(v)
  if (isNil(v)) return []
  if (!isArray(v)) v = stringify(v)
  const shuffled = [...v].sort(() => Math.random() - 0.5)
  if (count === 1) return shuffled[0]
  return shuffled.slice(0, count)
}
