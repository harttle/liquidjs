import { Drop } from './drop'
import { IComparable } from './icomparable'
import { isNil, toValue } from '../util/underscore'
import { BlankDrop } from '../drop/blank-drop'

export class NullDrop extends Drop implements IComparable {
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
