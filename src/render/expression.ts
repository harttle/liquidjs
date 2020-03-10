import { assert } from '../util/assert'
import { rangeLine } from '../parser/lexical'
import { parseLiteral } from '../parser/literal'
import { Context } from '../context/context'
import { range, toValue } from '../util/underscore'
import { isOperator, precedence, operatorImpls } from './operator'
import { Tokenizer } from '../parser/tokenizer'

export class Expression {
  private operands: any[] = []
  private postfix: string[]

  public constructor (str = '') {
    const tokenizer = new Tokenizer(str)
    this.postfix = [...toPostfix(tokenizer.readExpression())]
  }
  public * evaluate (ctx: Context): any {
    assert(ctx, 'unable to evaluate: context not defined')

    for (const token of this.postfix) {
      if (isOperator(token)) {
        const r = this.operands.pop()
        const l = this.operands.pop()
        const result = operatorImpls[token](l, r)
        this.operands.push(result)
      } else if (isRange(token)) {
        this.operands.push(yield rangeValue(token, ctx))
      } else {
        const literal = parseLiteral(token)
        this.operands.push(literal !== undefined ? literal : yield ctx.get(token))
      }
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

function * rangeValue (token: string, ctx: Context) {
  let match
  if ((match = token.match(rangeLine))) {
    const low = yield new Expression(match[1]).value(ctx)
    const high = yield new Expression(match[2]).value(ctx)
    return range(+low, +high + 1)
  }
}

function isRange (str: string) {
  return rangeLine.test(str)
}
