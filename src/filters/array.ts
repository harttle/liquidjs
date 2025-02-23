import { toArray, argumentsToValue, toValue, stringify, caseInsensitiveCompare, isArray, isNil, last as arrayLast, isArrayLike, toEnumerable } from '../util'
import { arrayIncludes, equals, evalToken, isTruthy } from '../render'
import { Value, FilterImpl } from '../template'
import { Tokenizer } from '../parser'
import type { Scope } from '../context'
import { EmptyDrop } from '../drop'

export const join = argumentsToValue(function (this: FilterImpl, v: any[], arg: string) {
  const array = toArray(v)
  const sep = isNil(arg) ? ' ' : stringify(arg)
  const complexity = array.length * (1 + sep.length)
  this.context.memoryLimit.use(complexity)
  return array.join(sep)
})
export const last = argumentsToValue((v: any) => isArrayLike(v) ? arrayLast(v) : '')
export const first = argumentsToValue((v: any) => isArrayLike(v) ? v[0] : '')
export const reverse = argumentsToValue(function (this: FilterImpl, v: any[]) {
  const array = toArray(v)
  this.context.memoryLimit.use(array.length)
  return [...array].reverse()
})

export function * sort<T> (this: FilterImpl, arr: T[], property?: string): IterableIterator<unknown> {
  const values: [T, string | number][] = []
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  for (const item of array) {
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

export function sort_natural<T> (this: FilterImpl, input: T[], property?: string) {
  const propertyString = stringify(property)
  const compare = property === undefined
    ? caseInsensitiveCompare
    : (lhs: T, rhs: T) => caseInsensitiveCompare(lhs[propertyString], rhs[propertyString])
  const array = toArray(input)
  this.context.memoryLimit.use(array.length)
  return [...array].sort(compare)
}

export const size = (v: string | any[]) => (v && v.length) || 0

export function * map (this: FilterImpl, arr: Scope[], property: string): IterableIterator<unknown> {
  const results = []
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  for (const item of array) {
    results.push(yield this.context._getFromScope(item, stringify(property), false))
  }
  return results
}

export function * sum (this: FilterImpl, arr: Scope[], property?: string): IterableIterator<unknown> {
  let sum = 0
  const array = toArray(arr)
  for (const item of array) {
    const data = Number(property ? yield this.context._getFromScope(item, stringify(property), false) : item)
    sum += Number.isNaN(data) ? 0 : data
  }
  return sum
}

export function compact<T> (this: FilterImpl, arr: T[]) {
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  return array.filter(x => !isNil(toValue(x)))
}

export function concat<T1, T2> (this: FilterImpl, v: T1[], arg: T2[] = []): (T1 | T2)[] {
  const lhs = toArray(v)
  const rhs = toArray(arg)
  this.context.memoryLimit.use(lhs.length + rhs.length)
  return lhs.concat(rhs)
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

export function pop<T> (v: T[]): T[] {
  const clone = [...toArray(v)]
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
  this.context.memoryLimit.use(length)
  return v.slice(begin, begin + length)
}

function expectedMatcher (this: FilterImpl, expected: any): (v: any) => boolean {
  if (this.context.opts.jekyllWhere) {
    return (v: any) => EmptyDrop.is(expected) ? equals(v, expected) : (isArray(v) ? arrayIncludes(v, expected) : equals(v, expected))
  } else if (expected === undefined) {
    return (v: any) => isTruthy(v, this.context)
  } else {
    return (v: any) => equals(v, expected)
  }
}

function * filter<T extends object> (this: FilterImpl, include: boolean, arr: T[], property: string, expected: any): IterableIterator<unknown> {
  const values: unknown[] = []
  arr = toArray(arr)
  this.context.memoryLimit.use(arr.length)
  const token = new Tokenizer(stringify(property)).readScopeValue()
  for (const item of arr) {
    values.push(yield evalToken(token, this.context.spawn(item)))
  }
  const matcher = expectedMatcher.call(this, expected)
  return arr.filter((_, i) => matcher(values[i]) === include)
}

function * filter_exp<T extends object> (this: FilterImpl, include: boolean, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const filtered: unknown[] = []
  const keyTemplate = new Value(stringify(exp), this.liquid)
  const array = toArray(arr)
  this.context.memoryLimit.use(array.length)
  for (const item of array) {
    this.context.push({ [itemName]: item })
    const value = yield keyTemplate.value(this.context)
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
    const key = yield evalToken(token, this.context.spawn(item))
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
    const key = yield keyTemplate.value(this.context)
    this.context.pop()
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }))
}

function * search<T extends object> (this: FilterImpl, arr: T[], property: string, expected: string): IterableIterator<unknown> {
  const token = new Tokenizer(stringify(property)).readScopeValue()
  const array = toArray(arr)
  const matcher = expectedMatcher.call(this, expected)
  for (let index = 0; index < array.length; index++) {
    const value = yield evalToken(token, this.context.spawn(array[index]))
    if (matcher(value)) return [index, array[index]]
  }
}

function * search_exp<T extends object> (this: FilterImpl, arr: T[], itemName: string, exp: string): IterableIterator<unknown> {
  const predicate = new Value(stringify(exp), this.liquid)
  const array = toArray(arr)
  for (let index = 0; index < array.length; index++) {
    this.context.push({ [itemName]: array[index] })
    const value = yield predicate.value(this.context)
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
  this.context.memoryLimit.use(count)
  const shuffled = [...v].sort(() => Math.random() - 0.5)
  if (count === 1) return shuffled[0]
  return shuffled.slice(0, count)
}
