import * as lexical from '../parser/lexical'
import assert from '../util/assert'
import Context from '../context/context'
import { range, last, isFunction, toValue } from '../util/underscore'
import { isComparable } from '../drop/icomparable'
import { NullDrop } from '../drop/null-drop'
import { EmptyDrop } from '../drop/empty-drop'
import { BlankDrop } from '../drop/blank-drop'

const binaryOperators: {[key: string]: (lhs: any, rhs: any) => boolean} = {
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
  'and': (l: any, r: any) => isTruthy(l) && isTruthy(r),
  'or': (l: any, r: any) => isTruthy(l) || isTruthy(r)
}

export async function parseExp (exp: string, ctx: Context): Promise<any> {
  assert(ctx, 'unable to parseExp: scope undefined')
  const operatorREs = lexical.operators
  let match
  for (let i = 0; i < operatorREs.length; i++) {
    const operatorRE = operatorREs[i]
    const expRE = new RegExp(`^(${lexical.quoteBalanced.source})(${operatorRE.source})(${lexical.quoteBalanced.source})$`)
    if ((match = exp.match(expRE))) {
      const l = await parseExp(match[1], ctx)
      const op = binaryOperators[match[2].trim()]
      const r = await parseExp(match[3], ctx)
      return op(l, r)
    }
  }

  if ((match = exp.match(lexical.rangeLine))) {
    const low = await evalValue(match[1], ctx)
    const high = await evalValue(match[2], ctx)
    return range(+low, +high + 1)
  }

  return parseValue(exp, ctx)
}

export async function evalExp (str: string, ctx: Context): Promise<any> {
  return toValue(await parseExp(str, ctx))
}

export async function parseValue (str: string | undefined, ctx: Context): Promise<any> {
  if (!str) return null
  str = str.trim()

  if (str === 'true') return true
  if (str === 'false') return false
  if (str === 'nil' || str === 'null') return new NullDrop()
  if (str === 'empty') return new EmptyDrop()
  if (str === 'blank') return new BlankDrop()
  if (!isNaN(Number(str))) return Number(str)
  if ((str[0] === '"' || str[0] === "'") && str[0] === last(str)) return str.slice(1, -1)
  return ctx.get(str)
}

export async function evalValue (str: string | undefined, ctx: Context) {
  return toValue(await parseValue(str, ctx))
}

export function isTruthy (val: any): boolean {
  return !isFalsy(val)
}

export function isFalsy (val: any): boolean {
  return val === false || undefined === val || val === null
}
