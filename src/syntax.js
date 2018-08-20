import Operators from './operators.js'
import * as lexical from './lexical.js'
import assert from './util/assert.js'

const operators = Operators(isTruthy)

export function evalExp (exp, scope) {
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
    const range = []
    for (let j = low; j <= high; j++) {
      range.push(j)
    }
    return range
  }

  return evalValue(exp, scope)
}

export function evalValue (str, scope) {
  str = str && str.trim()
  if (!str) return undefined

  if (lexical.isLiteral(str)) {
    return lexical.parseLiteral(str)
  }
  if (lexical.isVariable(str)) {
    return scope.get(str)
  }
  throw new TypeError(`cannot eval '${str}' as value`)
}

export function isTruthy (val) {
  return !isFalsy(val)
}

export function isFalsy (val) {
  return val === false || undefined === val || val === null
}
