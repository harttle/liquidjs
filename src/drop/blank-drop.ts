import { isNil, isString } from '../util/underscore'
import { Drop } from '../drop/drop'
import { EmptyDrop } from '../drop/empty-drop'

export class BlankDrop extends EmptyDrop {
  equals (value: any) {
    if (value === false) return true
    if (isNil(value instanceof Drop ? value.valueOf() : value)) return true
    if (isString(value)) return /^\s*$/.test(value)
    return super.equals(value)
  }
}
