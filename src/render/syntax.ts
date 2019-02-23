import * as lexical from '../parser/lexical'
import assert from '../util/assert'
import Scope from 'src/scope/scope'
import { range } from 'src/util/underscore'

const operators = {
  '==': (l: any, r: any) => l === r,
  '!=': (l: any, r: any) => l !== r,
  '>': (l: any, r: any) => l !== null && r !== null && l > r,
  '<': (l: any, r: any) => l !== null && r !== null && l < r,
  '>=': (l: any, r: any) => l !== null && r !== null && l >= r,
  '<=': (l: any, r: any) => l !== null && r !== null && l <= r,
  'contains': (l: any, r: any) => {
    if (!l) return false
    if (typeof l.indexOf !== 'function') return false
    return l.indexOf(r) > -1
  },
  'and': (l: any, r: any) => isTruthy(l) && isTruthy(r),
  'or': (l: any, r: any) => isTruthy(l) || isTruthy(r)
}

export function evalExp (exp: string, scope: Scope): any {
  assert(scope, 'unable to evalExp: scope undefined')
  const operatorREs = lexical.operators
  let match
  for (let i = 0; i < operatorREs.length; i++) {
    const operatorRE = operatorREs[i]
    const expRE = new RegExp(`^(${lexical.quoteBalanced.source})(${operatorRE.source})(${lexical.quoteBalanced.source})$`)
    if ((match = exp.match(expRE))) {
      const l = evalExp(match[1], scope)
      const op = operators[match[2].trim()]
      const r = evalExp(match[3], scope)
      return op(l, r)
    }
  }

  if ((match = exp.match(lexical.rangeLine))) {
    const low = evalValue(match[1], scope)
    const high = evalValue(match[2], scope)
    return range(low, high + 1)
  }

  return evalValue(exp, scope)
}

export function evalValue (str: string, scope: Scope) {
  if (!str) return null
  str = str.trim()
  if (!str) return undefined

  if (lexical.isLiteral(str)) {
    return lexical.parseLiteral(str)
  }
  if (lexical.isVariable(str)) {
    return scope.get(str)
  }
  throw new TypeError(`cannot eval '${str}' as value`)
}

export function isTruthy (val: any): boolean {
  return !isFalsy(val)
}

export function isFalsy (val: any): boolean {
  return val === false || undefined === val || val === null
}
