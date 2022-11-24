import { isNil, isString, isObject, isArray, isIterable, toValue } from './underscore'

export function toEnumerable<T = unknown> (val: any): T[] {
  val = toValue(val)
  if (isArray(val)) return val
  if (isString(val) && val.length > 0) return [val] as unknown as T[]
  if (isIterable(val)) return Array.from(val)
  if (isObject(val)) return Object.keys(val).map((key) => [key, val[key]]) as unknown as T[]
  return []
}

export function toArray (val: any) {
  if (isNil(val)) return []
  if (isArray(val)) return val
  return [ val ]
}
