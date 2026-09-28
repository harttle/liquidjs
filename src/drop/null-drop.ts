import { Drop } from './drop'
import { Comparable } from './comparable'
import { isNil, toValue } from '../util'

export class NullDrop extends Drop implements Comparable {
  public * equals (value: any): Generator<unknown, boolean, any> {
    return isNil(yield toValue(value))
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
