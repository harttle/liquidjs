import { isFalsy } from '../../render/boolean'
import { isArray, isString, toValue } from '../../util/underscore'
import { FilterImpl } from '../../template/filter/filter-impl'

export function Default<T1 extends boolean, T2> (this: FilterImpl, value: T1, defaultValue: T2, ...args: Array<[string, any]>): T1 | T2 {
  if (isArray(value) || isString(value)) return value.length ? value : defaultValue
  value = toValue(value)
  if (value === false && (new Map(args)).get('allow_false')) return false as T1
  return isFalsy(value, this.context) ? defaultValue : value
}

export function json (value: any) {
  return JSON.stringify(value)
}
