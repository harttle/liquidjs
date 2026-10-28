import { isFunction } from '../util'

/**
 * Comparison methods may return a boolean, a promise, or a generator.
 * Operators yield the result, so sync implementations stay valid and async
 * `valueOf()` can be awaited with `yield`.
 */
export type ComparableResult = boolean | Promise<boolean> | Generator<unknown, boolean, any>

export interface Comparable {
  equals: (rhs: any) => ComparableResult;
  gt: (rhs: any) => ComparableResult;
  geq: (rhs: any) => ComparableResult;
  lt: (rhs: any) => ComparableResult;
  leq: (rhs: any) => ComparableResult;
}

export function isComparable (arg: any): arg is Comparable {
  return (
    arg &&
    isFunction(arg.equals) &&
    isFunction(arg.gt) &&
    isFunction(arg.geq) &&
    isFunction(arg.lt) &&
    isFunction(arg.leq)
  )
}
