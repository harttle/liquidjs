import { isString, isObject, isArray } from './underscore'

export function toCollection (val: any) {
  if (isArray(val)) return val
  if (isString(val) && val.length > 0) return [val]
  if (isObject(val)) return Object.keys(val).map((key) => [key, val[key]])
  return []
}
