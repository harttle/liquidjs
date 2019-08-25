import { assert } from '../util/assert'
import { isRange, rangeValue } from './range'
import { Value } from './value'
import { Context } from '../context/context'
import { toValue } from '../util/underscore'
import { isOperator, precedence, operatorImpls } from './operator'

export class Expression {
  private str: string

  public constructor (str: string = '') {
    this.str = str
  }
  public evaluate (ctx: Context): any {
    assert(ctx, 'unable to evaluate: context not defined')

    const operands = []
    for (const token of toPostfix(this.str)) {
      if (isOperator(token)) {
        const r = operands.pop()
        const l = operands.pop()
        const result = operatorImpls[token](l, r)
        operands.push(result)
        continue
      }
      if (isRange(token)) {
        operands.push(rangeValue(token, ctx))
        continue
      }
      operands.push(new Value(token).evaluate(ctx))
    }
    return operands[0]
  }
  public value (ctx: Context): any {
    return toValue(this.evaluate(ctx))
  }
}

function * tokenize (expr: string): IterableIterator<string> {
  const N = expr.length
  let str = ''
  const pairs = { '"': '"', "'": "'", '[': ']', '(': ')' }

  for (let i = 0; i < N; i++) {
    const c = expr[i]
    switch (c) {
      case '[':
      case '"':
      case "'":
        str += c
        while (i + 1 < N) {
          str += expr[++i]
          if (expr[i] === pairs[c]) break
        }
        break
      case ' ':
      case '\t':
      case '\n':
        if (str) yield str
        str = ''
        break
      default:
        str += c
    }
  }
  if (str) yield str
}

function * toPostfix (expr: string): IterableIterator<string> {
  const ops = []
  for (const token of tokenize(expr)) {
    if (isOperator(token)) {
      while (ops.length && precedence[ops[ops.length - 1]] > precedence[token]) {
        yield ops.pop()!
      }
      ops.push(token)
    } else yield token
  }
  while (ops.length) {
    yield ops.pop()!
  }
}
