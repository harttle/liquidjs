import { assert } from '../util/assert'
import { isRange, rangeValue } from './range'
import { Value } from './value'
import { Context } from '../context/context'
import { toValue } from '../util/underscore'
import { isOperator, precedence, operatorImpls } from './operator'

export class Expression {
  private operands: any[] = []
  private postfix: string[]

  public constructor (str = '') {
    this.postfix = [...toPostfix(str)]
  }
  public * evaluate (ctx: Context) {
    assert(ctx, 'unable to evaluate: context not defined')

    for (const token of this.postfix) {
      if (isOperator(token)) {
        this.evaluateOnce(token)
      } else if (isRange(token)) {
        this.operands.push(yield rangeValue(token, ctx))
      } else this.operands.push(yield new Value(token).evaluate(ctx))
    }
    return this.operands[0]
  }
  public * value (ctx: Context) {
    return toValue(yield this.evaluate(ctx))
  }
  private evaluateOnce (token: string) {
    const r = this.operands.pop()
    const l = this.operands.pop()
    const result = operatorImpls[token](l, r)
    this.operands.push(result)
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
