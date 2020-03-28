import { Drop } from './drop'
import { Comparable } from './comparable'
import { isNil, toValue } from '../util/underscore'
import { BlankDrop } from '../drop/blank-drop'

export class NullDrop extends Drop implements Comparable {
  public equals (value: any) {
    return isNil(toValue(value)) || value instanceof BlankDrop
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
    return null
  }
}
