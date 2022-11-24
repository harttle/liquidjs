import { isComparable } from '../drop/comparable'
import { Context } from '../context'
import { isFunction, toValue } from '../util'
import { isTruthy } from '../render/boolean'

export type OperatorHandler = (lhs: any, rhs: any, ctx: Context) => boolean;
export type Operators = Record<string, OperatorHandler>

export const defaultOperators: Operators = {
  '==': (l: any, r: any) => {
    if (isComparable(l)) return l.equals(r)
    if (isComparable(r)) return r.equals(l)
    return toValue(l) === toValue(r)
  },
  '!=': (l: any, r: any) => {
    if (isComparable(l)) return !l.equals(r)
    if (isComparable(r)) return !r.equals(l)
    return toValue(l) !== toValue(r)
  },
  '>': (l: any, r: any) => {
    if (isComparable(l)) return l.gt(r)
    if (isComparable(r)) return r.lt(l)
    return toValue(l) > toValue(r)
  },
  '<': (l: any, r: any) => {
    if (isComparable(l)) return l.lt(r)
    if (isComparable(r)) return r.gt(l)
    return toValue(l) < toValue(r)
  },
  '>=': (l: any, r: any) => {
    if (isComparable(l)) return l.geq(r)
    if (isComparable(r)) return r.leq(l)
    return toValue(l) >= toValue(r)
  },
  '<=': (l: any, r: any) => {
    if (isComparable(l)) return l.leq(r)
    if (isComparable(r)) return r.geq(l)
    return toValue(l) <= toValue(r)
  },
  'contains': (l: any, r: any) => {
    l = toValue(l)
    r = toValue(r)
    return l && isFunction(l.indexOf) ? l.indexOf(r) > -1 : false
  },
  'and': (l: any, r: any, ctx: Context) => isTruthy(toValue(l), ctx) && isTruthy(toValue(r), ctx),
  'or': (l: any, r: any, ctx: Context) => isTruthy(toValue(l), ctx) || isTruthy(toValue(r), ctx)
}
