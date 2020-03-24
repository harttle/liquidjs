import { isFalsy } from '../../render/boolean'
import { toValue } from '../../util/underscore'

export function Default<T1, T2> (v: string | T1, arg: T2): string | T1 | T2 {
  return isFalsy(toValue(v)) || v === '' ? arg : v
}
export function json (v: any) {
  return JSON.stringify(v)
}
