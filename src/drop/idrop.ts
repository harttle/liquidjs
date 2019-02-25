import { Drop } from './drop'
import { isFunction } from '../util/underscore'

export interface IDrop {
  value(): any
}

export function isDrop (value: any): value is IDrop {
  return value instanceof Drop && isFunction((value as any).value)
}
