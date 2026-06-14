import { isFalsy } from '../render/boolean'
import { identify, isArray, isString, toValue } from '../util/underscore'
import { Limiter } from '../util/limiter'
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

function jsonReplacer (memoryLimit: Limiter, width: number, detectCircular: boolean) {
  const ancestors: unknown[] = []
  return function (this: unknown, key: string, value: any) {
    // `this` is the parent holding `value`; popping ancestors back to it yields the
    // nesting depth, so we can charge a lower bound of the bytes `value` adds to the
    // output (its own content, its key, and the indentation of its line).
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop()
    const keySize = isArray(this) ? 0 : key.length
    memoryLimit.use(jsonNodeSize(value) + keySize + ancestors.length * width)
    if (value === null || typeof value !== 'object') return value
    if (detectCircular && ancestors.includes(value)) return '[Circular]'
    ancestors.push(value)
    return value
  }
}

function json (this: FilterImpl, value: any, space: number | string = 0) {
  return JSON.stringify(value, jsonReplacer(this.context.memoryLimit, indentWidth(space), false), space)
}

function inspect (this: FilterImpl, value: any, space: number | string = 0) {
  return JSON.stringify(value, jsonReplacer(this.context.memoryLimit, indentWidth(space), true), space)
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
