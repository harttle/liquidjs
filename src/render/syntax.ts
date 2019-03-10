import * as lexical from '../parser/lexical'
import assert from '../util/assert'
import Scope from '../scope/scope'
import { range, last } from '../util/underscore'
import { isComparable } from '../drop/icomparable'
import { NullDrop } from '../drop/null-drop'
import { EmptyDrop } from '../drop/empty-drop'
import { BlankDrop } from '../drop/blank-drop'
import { Drop } from '../drop/drop'

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
    if (!l) return false
    if (typeof l.indexOf !== 'function') return false
    return l.indexOf(r) > -1
  },
  'and': (l: any, r: any) => isTruthy(l) && isTruthy(r),
  'or': (l: any, r: any) => isTruthy(l) || isTruthy(r)
}

export async function parseExp (exp: string, scope: Scope): Promise<any> {
  assert(scope, 'unable to parseExp: scope undefined')
  const operatorREs = lexical.operators
  let match
  for (let i = 0; i < operatorREs.length; i++) {
    const operatorRE = operatorREs[i]
    const expRE = new RegExp(`^(${lexical.quoteBalanced.source})(${operatorRE.source})(${lexical.quoteBalanced.source})$`)
    if ((match = exp.match(expRE))) {
      const l = await parseExp(match[1], scope)
      const op = binaryOperators[match[2].trim()]
      const r = await parseExp(match[3], scope)
      return op(l, r)
    }
  }

  if ((match = exp.match(lexical.rangeLine))) {
    const low = await evalValue(match[1], scope)
    const high = await evalValue(match[2], scope)
    return range(+low, +high + 1)
  }

  return parseValue(exp, scope)
}

export async function evalExp (str: string, scope: Scope): Promise<any> {
  const value = await parseExp(str, scope)
  return value instanceof Drop ? value.valueOf() : value
}

async function parseValue (str: string | undefined, scope: Scope): Promise<any> {
  if (!str) return null
  str = str.trim()

  if (str === 'true') return true
  if (str === 'false') return false
  if (str === 'nil' || str === 'null') return new NullDrop()
  if (str === 'empty') return new EmptyDrop()
  if (str === 'blank') return new BlankDrop()
  if (!isNaN(Number(str))) return Number(str)
  if ((str[0] === '"' || str[0] === "'") && str[0] === last(str)) return str.slice(1, -1)
  return scope.get(str)
}

export async function evalValue (str: string | undefined, scope: Scope) {
  const value = await parseValue(str, scope)
  return value instanceof Drop ? value.valueOf() : value
}

export function isTruthy (val: any): boolean {
  return !isFalsy(val)
}

export function isFalsy (val: any): boolean {
  return val === false || undefined === val || val === null
}
