import { Drop } from './drop'
import { IComparable } from './icomparable'
import { isNil } from 'src/util/underscore'
import { IDrop, isDrop } from 'src/drop/idrop'
import { BlankDrop } from 'src/drop/blank-drop'

export class NullDrop extends Drop implements IDrop, IComparable {
  equals (value: any) {
    return isNil(isDrop(value) ? value.value() : value) || value instanceof BlankDrop
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
  value () {
    return null
  }
}
