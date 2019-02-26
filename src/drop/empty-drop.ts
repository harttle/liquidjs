import { Drop } from './drop'
import { IComparable } from './icomparable'
import { isObject, isString, isArray } from '../util/underscore'

export class EmptyDrop extends Drop implements IComparable {
  equals (value: any) {
    if (isString(value) || isArray(value)) return value.length === 0
    if (isObject(value)) return Object.keys(value).length === 0
    return false
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
    return ''
  }
}
