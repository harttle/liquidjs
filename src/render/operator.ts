import { isComparable } from '../drop/comparable'
import { Context } from '../context/context'
import { isFunction } from '../util/underscore'
import { isTruthy } from '../render/boolean'

export interface Operators {
  [key: string]: (lhs: any, rhs: any, ctx: Context) => boolean;
}

export const defaultOperators: Operators = {
  '==': (l: any, r: any) => {
    if (isComparable(l)) return l.equals(r)
    if (isComparable(r)) return r.equals(l)
    return l === r
  },
  '!=': (l: any, r: any) => {
    if (isComparable(l)) return !l.equals(r)
    if (isComparable(r)) return !r.equals(l)
    return l !== r
  },
  '>': (l: any, r: any) => {
    if (isComparable(l)) return l.gt(r)
    if (isComparable(r)) return r.lt(l)
    return l > r
  },
  '<': (l: any, r: any) => {
    if (isComparable(l)) return l.lt(r)
    if (isComparable(r)) return r.gt(l)
    return l < r
  },
  '>=': (l: any, r: any) => {
    if (isComparable(l)) return l.geq(r)
    if (isComparable(r)) return r.leq(l)
    return l >= r
  },
  '<=': (l: any, r: any) => {
    if (isComparable(l)) return l.leq(r)
    if (isComparable(r)) return r.geq(l)
    return l <= r
  },
  'contains': (l: any, r: any) => {
    return l && isFunction(l.indexOf) ? l.indexOf(r) > -1 : false
  },
  'and': (l: any, r: any, ctx: Context) => isTruthy(l, ctx) && isTruthy(r, ctx),
  'or': (l: any, r: any, ctx: Context) => isTruthy(l, ctx) || isTruthy(r, ctx)
}
