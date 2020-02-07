import { assert } from '../util/assert'
import { isRange, rangeValue } from './range'
import { Value } from './value'
import { Context } from '../context/context'
import { toValue } from '../util/underscore'
import { isOperator, precedence, operatorImpls } from './operator'
import { tokenize } from '../parser/expression-tokenizer'

export class Expression {
  private operands: any[] = []
  private postfix: string[]

  public constructor (str = '') {
    this.postfix = [...toPostfix(tokenize(str))]
  }
  public * evaluate (ctx: Context) {
    assert(ctx, 'unable to evaluate: context not defined')

    for (const token of this.postfix) {
      if (isOperator(token)) {
        const r = this.operands.pop()
        const l = this.operands.pop()
        const result = operatorImpls[token](l, r)
        this.operands.push(result)
      } else if (isRange(token)) {
        this.operands.push(yield rangeValue(token, ctx))
      } else this.operands.push(yield new Value(token).evaluate(ctx))
    }
    return this.operands[0]
  }
  public * value (ctx: Context) {
    return toValue(yield this.evaluate(ctx))
  }
}

function * toPostfix (tokens: IterableIterator<string>): IterableIterator<string> {
  const ops = []
  for (const token of tokens) {
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
