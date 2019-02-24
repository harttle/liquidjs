import { isNil, isString } from 'src/util/underscore'
import { isDrop } from 'src/drop/idrop'
import { EmptyDrop } from 'src/drop/empty-drop'

export class BlankDrop extends EmptyDrop {
  equals (value: any) {
    if (value === false) return true
    if (isNil(isDrop(value) ? value.value() : value)) return true
    if (isString(value)) return /^\s*$/.test(value)
    return super.equals(value)
  }
}
