import { isComparable } from '../drop/comparable'
import { Context } from '../context'
import { toValue } from '../util'
import { isFalsy, isTruthy } from '../render/boolean'
import { isArray, isFunction } from '../util/underscore'

/**
 * A handler may return a `boolean` (legacy interface), a `Promise`, or a generator
 * that `yield`s to await async values. The render driver resolves all three, so
 * operators written against the legacy `=> boolean` signature keep working.
 */
export type OperatorGenerator = Generator<unknown, boolean, any>
export type OperatorResult = boolean | Promise<boolean> | OperatorGenerator
export type UnaryOperatorHandler = (operand: any, ctx: Context) => OperatorResult;
export type BinaryOperatorHandler = (lhs: any, rhs: any, ctx: Context) => OperatorResult;
export type OperatorHandler = UnaryOperatorHandler | BinaryOperatorHandler;
export type Operators = Record<string, OperatorHandler>

export const defaultOperators: Operators = {
  '==': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l) || isComparable(r)) return equals(l, r)
    return equals(yield toValue(l), yield toValue(r))
  },
  '!=': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l) || isComparable(r)) return !equals(l, r)
    return !equals(yield toValue(l), yield toValue(r))
  },
  '>': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return l.gt(r)
    if (isComparable(r)) return r.lt(l)
    return (yield toValue(l)) > (yield toValue(r))
  },
  '<': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return l.lt(r)
    if (isComparable(r)) return r.gt(l)
    return (yield toValue(l)) < (yield toValue(r))
  },
  '>=': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return l.geq(r)
    if (isComparable(r)) return r.leq(l)
    return (yield toValue(l)) >= (yield toValue(r))
  },
  '<=': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return l.leq(r)
    if (isComparable(r)) return r.geq(l)
    return (yield toValue(l)) <= (yield toValue(r))
  },
  'contains': function * (l: any, r: any): OperatorGenerator {
    l = yield toValue(l)
    if (isArray(l)) return l.some((i) => equals(i, r))
    if (isFunction(l?.indexOf)) return l.indexOf(yield toValue(r)) > -1
    return false
  },
  'not': function * (v: any, ctx: Context): OperatorGenerator { return isFalsy(yield toValue(v), ctx) },
  'and': function * (l: any, r: any, ctx: Context): OperatorGenerator { return isTruthy(yield toValue(l), ctx) && isTruthy(yield toValue(r), ctx) },
  'or': function * (l: any, r: any, ctx: Context): OperatorGenerator { return isTruthy(yield toValue(l), ctx) || isTruthy(yield toValue(r), ctx) }
}

export function equals (lhs: any, rhs: any): boolean {
  if (isComparable(lhs)) return lhs.equals(rhs)
  if (isComparable(rhs)) return rhs.equals(lhs)
  lhs = toValue(lhs)
  rhs = toValue(rhs)
  if (isArray(lhs)) {
    return isArray(rhs) && arrayEquals(lhs, rhs)
  }
  return lhs === rhs
}

function arrayEquals (lhs: any[], rhs: any[]): boolean {
  if (lhs.length !== rhs.length) return false
  return !lhs.some((value, i) => !equals(value, rhs[i]))
}

export function arrayIncludes (arr: any[], item: any): boolean {
  return arr.some(value => equals(value, item))
}
