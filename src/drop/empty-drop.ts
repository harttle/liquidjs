import { Drop } from './drop'
import { IComparable } from './icomparable'
import { isObject, isString, isArray } from '../util/underscore'

export class EmptyDrop extends Drop implements IComparable {
  public equals (value: any) {
    if (isString(value) || isArray(value)) return value.length === 0
    if (isObject(value)) return Object.keys(value).length === 0
    return false
  }
  public gt () {
    return false
  }
  public geq () {
    return false
  }
  public lt () {
    return false
  }
  public leq () {
    return false
  }
  public valueOf () {
    return ''
  }
}
