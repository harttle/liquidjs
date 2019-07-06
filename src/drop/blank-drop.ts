import { isNil, isString, toValue } from '../util/underscore'
import { EmptyDrop } from '../drop/empty-drop'

export class BlankDrop extends EmptyDrop {
  public equals (value: any) {
    if (value === false) return true
    if (isNil(toValue(value))) return true
    if (isString(value)) return /^\s*$/.test(value)
    return super.equals(value)
  }
}
