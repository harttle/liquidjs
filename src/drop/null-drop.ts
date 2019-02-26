import { Drop } from './drop'
import { IComparable } from './icomparable'
import { isNil } from '../util/underscore'
import { BlankDrop } from '../drop/blank-drop'

export class NullDrop extends Drop implements IComparable {
  equals (value: any) {
    return isNil(value instanceof Drop ? value.valueOf() : value) || value instanceof BlankDrop
  }
  gt () {
    return false
  }
  geq () {
    return false
  }
  lt () {
    return false
  }
  leq () {
    return false
  }
  valueOf () {
    return null
  }
}
