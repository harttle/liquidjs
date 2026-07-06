import { isFalsy } from '../render/boolean'
import { identify, isArray, isString, toValue } from '../util/underscore'
import { FilterImpl } from '../template'

function chargeJsonReplacerValue (memoryLimit: { use(count: number): void }, val: unknown) {
  if (typeof val === 'string') {
    memoryLimit.use(val.length)
  } else if (val === null || typeof val === 'number' || typeof val === 'boolean') {
    memoryLimit.use(JSON.stringify(val).length)
  } else if (Array.isArray(val)) {
    memoryLimit.use(val.length + 1)
  } else if (typeof val === 'object') {
    memoryLimit.use(2)
  }
}

function defaultFilter<T1 extends boolean, T2> (this: FilterImpl, value: T1, defaultValue: T2, ...args: Array<[string, any]>): T1 | T2 {
  value = toValue(value)
  if (isArray(value) || isString(value)) return value.length ? value : defaultValue
  if (value === false && (new Map(args)).get('allow_false')) return false as T1
  return isFalsy(value, this.context) ? defaultValue : value
}

function json (this: FilterImpl, value: any, space = 0) {
  const memoryLimit = this.context.memoryLimit
  return JSON.stringify(value, (_key, val) => {
    chargeJsonReplacerValue(memoryLimit, val)
    return val
  }, space)
}

function inspect (this: FilterImpl, value: any, space = 0) {
  const memoryLimit = this.context.memoryLimit
  const ancestors: object[] = []
  return JSON.stringify(value, function (this: unknown, _key: unknown, value: any) {
    if (typeof value !== 'object' || value === null) {
      chargeJsonReplacerValue(memoryLimit, value)
      return value
    }
    // `this` is the object that value is contained in, i.e., its direct parent.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop()
    if (ancestors.includes(value)) {
      memoryLimit.use('[Circular]'.length)
      return '[Circular]'
    }
    ancestors.push(value)
    chargeJsonReplacerValue(memoryLimit, value)
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
