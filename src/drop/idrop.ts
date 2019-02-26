import { Drop } from './drop'
import { isFunction } from '../util/underscore'

export interface IDrop {
  valueOf(): any
}

export function isDrop (value: any): value is IDrop {
  return value instanceof Drop && isFunction((value as any).valueOf)
}
