const operators = require('./operators.js')(isTruthy)
const lexical = require('./lexical.js')
const assert = require('./util/assert.js')

function evalExp (exp, scope) {
  assert(scope, 'unable to evalExp: scope undefined')
  let operatorREs = lexical.operators
  let match
  for (let i = 0; i < operatorREs.length; i++) {
    let operatorRE = operatorREs[i]
    let expRE = new RegExp(`^(${lexical.quoteBalanced.source})(${operatorRE.source})(${lexical.quoteBalanced.source})$`)
    if ((match = exp.match(expRE))) {
      let l = evalExp(match[1], scope)
      let op = operators[match[2].trim()]
      let r = evalExp(match[3], scope)
      return op(l, r)
    }
  }

  if ((match = exp.match(lexical.rangeLine))) {
    let low = evalValue(match[1], scope)
    let high = evalValue(match[2], scope)
    let range = []
    for (let j = low; j <= high; j++) {
      range.push(j)
    }
    return range
  }

  return evalValue(exp, scope)
}

function evalValue (str, scope) {
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

function isTruthy (val) {
  return !isFalsy(val)
}

function isFalsy (val) {
  return val === false || undefined === val || val === null
}

module.exports = {
  evalExp, evalValue, isTruthy, isFalsy
}
