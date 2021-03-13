import { Drop } from './drop'
import { Comparable } from './comparable'
import { isObject, isString, isArray, toValue } from '../util/underscore'

export class EmptyDrop extends Drop implements Comparable {
  public equals (value: any) {
    if (value instanceof EmptyDrop) return false
    value = toValue(value)
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
