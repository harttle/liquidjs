import { isFalsy } from '../render/boolean'
import { identify, isArray, isString, toValue } from '../util/underscore'
import { FilterImpl } from '../template'

function defaultFilter<T1 extends boolean, T2> (this: FilterImpl, value: T1, defaultValue: T2, ...args: Array<[string, any]>): T1 | T2 {
  value = toValue(value)
  if (isArray(value) || isString(value)) return value.length ? value : defaultValue
  if (value === false && (new Map(args)).get('allow_false')) return false as T1
  return isFalsy(value, this.context) ? defaultValue : value
}

// A strict lower bound on the bytes a single node contributes to JSON output,
// excluding its children (which are visited separately). Charging this per node
// during traversal lets `memoryLimit` abort before the full string is built,
// while never over-charging an in-budget input (total charged <= output.length).
function jsonNodeSize (value: any): number {
  if (value === null) return 4 // null
  switch (typeof value) {
    case 'string': return value.length + 2 // quotes; escapes only add more
    case 'number': return ('' + value).length
    case 'boolean': return value ? 4 : 5
    case 'object': return 2 // {} or [] braces; entries charged on their own visits
    default: return 0 // undefined/function/symbol are omitted from output
  }
}

function json (this: FilterImpl, value: any, space = 0) {
  const memoryLimit = this.context.memoryLimit
  return JSON.stringify(value, (_key: string, value: any) => {
    memoryLimit.use(jsonNodeSize(value))
    return value
  }, space)
}

function inspect (this: FilterImpl, value: any, space = 0) {
  const memoryLimit = this.context.memoryLimit
  const ancestors: object[] = []
  return JSON.stringify(value, function (this: unknown, _key: unknown, value: any) {
    memoryLimit.use(jsonNodeSize(value))
    if (typeof value !== 'object' || value === null) return value
    // `this` is the object that value is contained in, i.e., its direct parent.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop()
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
