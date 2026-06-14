import { isFalsy } from '../render/boolean'
import { identify, isArray, isString, toValue } from '../util/underscore'
import { FilterImpl } from '../template'

function defaultFilter<T1 extends boolean, T2> (this: FilterImpl, value: T1, defaultValue: T2, ...args: Array<[string, any]>): T1 | T2 {
  value = toValue(value)
  if (isArray(value) || isString(value)) return value.length ? value : defaultValue
  if (value === false && (new Map(args)).get('allow_false')) return false as T1
  return isFalsy(value, this.context) ? defaultValue : value
}

function jsonNodeSize (value: any): number {
  if (value === null) return 4
  switch (typeof value) {
    case 'string': return value.length + 2
    case 'number': return ('' + value).length
    case 'boolean': return value ? 4 : 5
    case 'object': return 2
    default: return 0
  }
}

function indentWidth (space: number | string): number {
  if (typeof space === 'string') return Math.min(space.length, 10)
  const n = Math.floor(space)
  return n > 0 ? Math.min(n, 10) : 0
}

function json (this: FilterImpl, value: any, space: number | string = 0) {
  const memoryLimit = this.context.memoryLimit
  const width = indentWidth(space)
  return JSON.stringify(value, function (this: unknown, key: string, value: any) {
    memoryLimit.use(jsonNodeSize(value) + (isArray(this) ? 0 : key.length) + width)
    return value
  }, space)
}

function inspect (this: FilterImpl, value: any, space: number | string = 0) {
  const memoryLimit = this.context.memoryLimit
  const ancestors: object[] = []
  return JSON.stringify(value, function (this: unknown, key: string, value: any) {
    if (typeof value !== 'object' || value === null) {
      memoryLimit.use(jsonNodeSize(value) + (isArray(this) ? 0 : key.length))
      return value
    }
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop()
    memoryLimit.use(jsonNodeSize(value) + (isArray(this) ? 0 : key.length))
    if (ancestors.includes(value)) return '[Circular]'
    ancestors.push(value)
    return value
  }, space)
}

function to_integer (value: any) {
  return Number(value)
}

const raw = {
  raw: true,
  handler: identify
}

export default {
  default: defaultFilter,
  raw,
  jsonify: json,
  to_integer,
  json,
  inspect
}
