import { isNil, isString, isObject, isArray, isIterable } from './underscore'

export function toEnumerable (val: any) {
  if (isArray(val)) return val
  if (isString(val) && val.length > 0) return [val]
  if (isIterable(val)) return Array.from(val)
  if (isObject(val)) return Object.keys(val).map((key) => [key, val[key]])
  return []
}

export function toArray (val: any) {
  if (isNil(val)) return []
  if (isArray(val)) return val
  return [ val ]
}
