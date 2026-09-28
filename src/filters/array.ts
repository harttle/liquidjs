import { toArray, argumentsToValue, toValue, stringify, caseInsensitiveCompare, orderedCompare, isArray, isNil, isArrayLike, readArrayElement, toEnumerable } from '../util'
import { arrayIncludes, equals, evalTokenValue, isTruthy } from '../render'
import { Value, FilterImpl } from '../template'
import { Tokenizer } from '../parser'
import type { Scope } from '../context'
import { EmptyDrop } from '../drop'

export const join = argumentsToValue(function (this: FilterImpl, v: any[], arg: string) {
  const array = toArray(v)
  const sep = isNil(arg) ? ' ' : stringify(arg)
  let outputSize = sep.length * Math.max(array.length - 1, 0)
  for (let i = 0; i < array.length; i++) outputSize += String(array[i]).length
  this.context.memoryLimit.use(outputSize)
  return Array.prototype.join.call(array, sep)
})
export const last = argumentsToValue(function (this: FilterImpl, v: any) {
  return isArrayLike(v) ? readArrayElement(v, -1, this.context.ownPropertyOnly) : ''
})
export const first = argumentsToValue(function (this: FilterImpl, v: any) {
  return isArrayLike(v) ? readArrayElement(v, 0, this.context.ownPropertyOnly) : ''
})
export const reverse = argumentsToValue(function (this: FilterImpl, v: any[]) {
  const array = toArray(v)
  this.context.memoryLimit.use(array.length)
  return [...array].reverse()
})

function * sortBy<T> (this: FilterImpl, arr: T[], property: string | undefined, comparator: (a: unknown, b: unknown) => number): IterableIterator<unknown> {
  const values: [T, unknown][] = []
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  for (const item of array) {
    const raw = property ? yield this.context._getFromScope(item, stringify(property).split('.'), false) : item
    values.push([item, yield toValue(raw)])
  }
  return values.sort((lhs, rhs) => comparator(lhs[1], rhs[1])).map(tuple => tuple[0])
}

export function * sort<T> (this: FilterImpl, arr: T[], property?: string): IterableIterator<unknown> {
  return yield * sortBy.call(this, arr, property, orderedCompare)
}

export function * sort_natural<T> (this: FilterImpl, arr: T[], property?: string): IterableIterator<unknown> {
  return yield * sortBy.call(this, arr, property, caseInsensitiveCompare)
}

export const size = (v: string | any[]) => (v && v.length) || 0

export function * map (this: FilterImpl, arr: Scope[], property: string): IterableIterator<unknown> {
  const results = []
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  for (const item of array) {
    results.push(yield toValue(yield this.context._getFromScope(item, stringify(property), false)))
  }
  return results
}

export function * sum (this: FilterImpl, arr: Scope[], property?: string): IterableIterator<unknown> {
  let sum = 0
  const array = toArray(arr)
  for (const item of array) {
    const raw = property ? yield this.context._getFromScope(item, stringify(property), false) : item
    const data = Number(yield toValue(raw))
    sum += Number.isNaN(data) ? 0 : data
  }
  return sum
}

export function compact<T> (this: FilterImpl, arr: T[]) {
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  return Array.prototype.filter.call(array, x => !isNil(toValue(x)))
}

export function concat<T1, T2> (this: FilterImpl, v: T1[], arg: T2[] = []): (T1 | T2)[] {
  const lhs = toArray(v)
  const rhs = toArray(arg)
  this.context.memoryLimit.use(lhs.length + rhs.length)
  return Array.prototype.concat.call(lhs, rhs)
}

export function push<T> (this: FilterImpl, v: T[], arg: T): T[] {
  return concat.call(this, v, [arg]) as T[]
}

export function unshift<T> (this: FilterImpl, v: T[], arg: T): T[] {
  const array = toArray(v)
  this.context.memoryLimit.use(array.length)
  const clone = [...array]
  clone.unshift(arg)
  return clone
}

export function pop<T> (this: FilterImpl, v: T[]): T[] {
  const array = toArray(v)
  this.context.memoryLimit.use(array.length)
  const clone = [...array]
  clone.pop()
  return clone
}

export function shift<T> (this: FilterImpl, v: T[]): T[] {
  const array = toArray(v)
  this.context.memoryLimit.use(array.length)
  const clone = [...array]
  clone.shift()
  return clone
}

export function slice<T> (this: FilterImpl, v: T[] | string, begin: number, length = 1): T[] | string {
  v = toValue(v)
  if (isNil(v)) return []
  if (!isArray(v)) v = stringify(v)
  begin = begin < 0 ? v.length + begin : begin
  if (begin < 0 || length < 0) return isArray(v) ? [] : ''
  this.context.memoryLimit.use(length)
  return isArray(v)
    ? Array.prototype.slice.call(v, begin, begin + length)
    : String.prototype.slice.call(v, begin, begin + length)
}

function * matches (this: FilterImpl, value: unknown, expected: unknown): Generator<unknown, boolean, any> {
  if (this.context.opts.jekyllWhere) {
    if (EmptyDrop.is(expected)) return yield equals(value, expected)
    if (isArray(value)) return yield arrayIncludes(value, expected)
    return yield equals(value, expected)
  }
  if (expected === undefined) return isTruthy(value, this.context)
  return yield equals(value, expected)
}

function * filter<T extends object> (this: FilterImpl, include: boolean, arr: T[], property: string, expected: any): IterableIterator<unknown> {
  arr = toArray(arr)
  this.context.memoryLimit.use(arr.length)
  const token = new Tokenizer(stringify(property)).readScopeValue()
  const result: T[] = []
  for (const item of arr) {
    const value = yield evalTokenValue(token, this.context.spawn(item))
    if ((yield matches.call(this, value, expected)) === include) result.push(item)
  }
  return result
}

function * filter_exp<T extends object> (this: FilterImpl, include: boolean, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const filtered: unknown[] = []
  const keyTemplate = new Value(stringify(exp), this.liquid)
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  for (const item of array) {
    this.context.push({ [itemName]: item })
    const value = yield toValue(yield keyTemplate.value(this.context))
    this.context.pop()
    if (value === include) filtered.push(item)
  }
  return filtered
}

export function * where<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): IterableIterator<unknown> {
  return yield * filter.call(this, true, arr, property, expected)
}

export function * reject<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): IterableIterator<unknown> {
  return yield * filter.call(this, false, arr, property, expected)
}

export function * where_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  return yield * filter_exp.call(this, true, arr, itemName, exp)
}

export function * reject_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  return yield * filter_exp.call(this, false, arr, itemName, exp)
}

export function * group_by<T extends object> (this: FilterImpl, arr: T[], property: string): IterableIterator<unknown> {
  const map = new Map()
  arr = toEnumerable(arr)
  const token = new Tokenizer(stringify(property)).readScopeValue()
  this.context.memoryLimit.use(arr.length)
  for (const item of arr) {
    const key = yield evalTokenValue(token, this.context.spawn(item))
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }))
}

export function * group_by_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const map = new Map()
  const keyTemplate = new Value(stringify(exp), this.liquid)
  arr = toEnumerable(arr)
  this.context.memoryLimit.use(arr.length)
  for (const item of arr) {
    this.context.push({ [itemName]: item })
    const key = yield toValue(yield keyTemplate.value(this.context))
    this.context.pop()
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }))
}

function * search<T extends object> (this: FilterImpl, arr: T[], property: string, expected: string): IterableIterator<unknown> {
  const token = new Tokenizer(stringify(property)).readScopeValue()
  const array = toArray(arr)
  for (let index = 0; index < array.length; index++) {
    const value = yield evalTokenValue(token, this.context.spawn(array[index]))
    if (yield matches.call(this, value, expected)) return [index, array[index]]
  }
}

function * search_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const predicate = new Value(stringify(exp), this.liquid)
  const array = toArray(arr)
  for (let index = 0; index < array.length; index++) {
    this.context.push({ [itemName]: array[index] })
    const value = yield toValue(yield predicate.value(this.context))
    this.context.pop()
    if (value) return [index, array[index]]
  }
}

export function * has<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): IterableIterator<unknown> {
  const result = yield * search.call(this, arr, property, expected)
  return !!result
}

export function * has_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const result = yield * search_exp.call(this, arr, itemName, exp)
  return !!result
}

export function * find_index<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): IterableIterator<unknown> {
  const result = yield * search.call(this, arr, property, expected)
  return result ? result[0] : undefined
}

export function * find_index_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const result = yield * search_exp.call(this, arr, itemName, exp)
  return result ? result[0] : undefined
}

export function * find<T extends object> (this: FilterImpl, arr: T[], property: string, expected?: any): IterableIterator<unknown> {
  const result = yield * search.call(this, arr, property, expected)
  return result ? result[1] : undefined
}

export function * find_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const result = yield * search_exp.call(this, arr, itemName, exp)
  return result ? result[1] : undefined
}

export function uniq<T> (this: FilterImpl, arr: T[]): T[] {
  arr = toArray(arr)
  this.context.memoryLimit.use(arr.length)
  return [...new Set(arr)]
}

export function sample<T> (this: FilterImpl, v: T[] | string, count = 1): T | string | (T | string)[] {
  v = toValue(v)
  if (isNil(v)) return []
  if (!isArray(v)) v = stringify(v)
  this.context.memoryLimit.use(v.length)
  const shuffled = [...v].sort(() => Math.random() - 0.5)
  if (count === 1) return shuffled[0]
  return shuffled.slice(0, count)
}
