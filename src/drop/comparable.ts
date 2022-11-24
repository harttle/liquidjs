import { isFunction } from '../util'

export interface Comparable {
  equals: (rhs: any) => boolean;
  gt: (rhs: any) => boolean;
  geq: (rhs: any) => boolean;
  lt: (rhs: any) => boolean;
  leq: (rhs: any) => boolean;
}

export function isComparable (arg: any): arg is Comparable {
  return arg && isFunction(arg.equals)
}
