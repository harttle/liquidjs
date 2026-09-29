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
  '==': function * (l: any, r: any): OperatorGenerator { return yield equals(l, r) },
  '!=': function * (l: any, r: any): OperatorGenerator { return !(yield equals(l, r)) },
  '>': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return yield l.gt(r)
    if (isComparable(r)) return yield r.lt(l)
    return (yield toValue(l)) > (yield toValue(r))
  },
  '<': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return yield l.lt(r)
    if (isComparable(r)) return yield r.gt(l)
    return (yield toValue(l)) < (yield toValue(r))
  },
  '>=': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return yield l.geq(r)
    if (isComparable(r)) return yield r.leq(l)
    return (yield toValue(l)) >= (yield toValue(r))
  },
  '<=': function * (l: any, r: any): OperatorGenerator {
    if (isComparable(l)) return yield l.leq(r)
    if (isComparable(r)) return yield r.geq(l)
    return (yield toValue(l)) <= (yield toValue(r))
  },
  'contains': function * (l: any, r: any): OperatorGenerator {
    l = yield toValue(l)
    if (isArray(l)) return yield arrayIncludes(l, r)
    if (isFunction(l?.indexOf)) return l.indexOf(yield toValue(r)) > -1
    return false
  },
  'not': function * (v: any, ctx: Context): OperatorGenerator { return isFalsy(yield toValue(v), ctx) },
  'and': function * (l: any, r: any, ctx: Context): OperatorGenerator { return isTruthy(yield toValue(l), ctx) && isTruthy(yield toValue(r), ctx) },
  'or': function * (l: any, r: any, ctx: Context): OperatorGenerator { return isTruthy(yield toValue(l), ctx) || isTruthy(yield toValue(r), ctx) }
}

export function * equals (lhs: any, rhs: any): Generator<unknown, boolean, any> {
  if (isComparable(lhs)) return yield lhs.equals(rhs)
  if (isComparable(rhs)) return yield rhs.equals(lhs)
  lhs = yield toValue(lhs)
  rhs = yield toValue(rhs)
  if (isArray(lhs)) {
    return isArray(rhs) && (yield arrayEquals(lhs, rhs))
  }
  return lhs === rhs
}

function * arrayEquals (lhs: any[], rhs: any[]): Generator<unknown, boolean, any> {
  if (lhs.length !== rhs.length) return false
  for (let i = 0; i < lhs.length; i++) {
    if (!(yield equals(lhs[i], rhs[i]))) return false
  }
  return true
}

export function * arrayIncludes (arr: any[], item: any): Generator<unknown, boolean, any> {
  for (const value of arr) {
    if (yield equals(value, item)) return true
  }
  return false
}
