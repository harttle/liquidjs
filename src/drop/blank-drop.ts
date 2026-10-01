import { isNil, isString, toValue } from '../util'
import { EmptyDrop } from '../drop'

export class BlankDrop extends EmptyDrop {
  public * equals (value: any): Generator<unknown, boolean, any> {
    if (value === false) return true
    if (isNil(yield toValue(value))) return true
    if (isString(value)) return /^\s*$/.test(value)
    return yield super.equals(value)
  }
  static is (value: unknown) {
    return value instanceof BlankDrop
  }
}
