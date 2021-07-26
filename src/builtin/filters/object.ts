import { isFalsy } from '../../render/boolean'
import { isArray, isString, toValue } from '../../util/underscore'
import { FilterImpl } from '../../template/filter/filter-impl'

export function Default<T1, T2> (this: FilterImpl, v: string | T1, arg: T2): string | T1 | T2 {
  if (isArray(v) || isString(v)) return v.length ? v : arg
  return isFalsy(toValue(v), this.context) ? arg : v
}
export function json (v: any) {
  return JSON.stringify(v)
}
