import { QuotedToken } from '../tokens/quoted-token'
import { PropertyAccessToken } from '../tokens/property-access-token'
import { NumberToken } from '../tokens/number-token'
import { assert } from '../util/assert'
import { literalValues } from '../util/literal'
import { LiteralToken } from '../tokens/literal-token'
import * as TypeGuards from '../util/type-guards'
import { Token } from '../tokens/token'
import { OperatorToken } from '../tokens/operator-token'
import { RangeToken } from '../tokens/range-token'
import { parseStringLiteral } from '../parser/parse-string-literal'
import { Context } from '../context/context'
import { range } from '../util/underscore'
import { Operators } from '../render/operator'
import { UndefinedVariableError } from '../util/error'

export class Expression {
  private postfix: Token[]

  public constructor (tokens: IterableIterator<Token>) {
    this.postfix = [...toPostfix(tokens)]
  }
  public * evaluate (ctx: Context, lenient: boolean): Generator<unknown, unknown, unknown> {
    assert(ctx, 'unable to evaluate: context not defined')
    const operands: any[] = []
    for (const token of this.postfix) {
      if (TypeGuards.isOperatorToken(token)) {
        const r = yield operands.pop()
        const l = yield operands.pop()
        const result = evalOperatorToken(ctx.opts.operators, token, l, r, ctx)
        operands.push(result)
      } else {
        operands.push(yield evalToken(token, ctx, lenient && this.postfix.length === 1))
      }
    }
    return operands[0]
  }
}

export function evalToken (token: Token | undefined, ctx: Context, lenient = false): any {
  if (TypeGuards.isPropertyAccessToken(token)) return evalPropertyAccessToken(token, ctx, lenient)
  if (TypeGuards.isRangeToken(token)) return evalRangeToken(token, ctx)
  if (TypeGuards.isLiteralToken(token)) return evalLiteralToken(token)
  if (TypeGuards.isNumberToken(token)) return evalNumberToken(token)
  if (TypeGuards.isWordToken(token)) return token.getText()
  if (TypeGuards.isQuotedToken(token)) return evalQuotedToken(token)
}

function evalPropertyAccessToken (token: PropertyAccessToken, ctx: Context, lenient: boolean) {
  const props: string[] = token.props.map(prop => evalToken(prop, ctx, false))
  try {
    return ctx.get([token.propertyName, ...props])
  } catch (e) {
    if (lenient && (e as Error).name === 'InternalUndefinedVariableError') return null
    throw (new UndefinedVariableError(e as Error, token))
  }
}

function evalNumberToken (token: NumberToken) {
  const str = token.whole.content + '.' + (token.decimal ? token.decimal.content : '')
  return Number(str)
}

export function evalQuotedToken (token: QuotedToken) {
  return parseStringLiteral(token.getText())
}

function evalOperatorToken (operators: Operators, token: OperatorToken, lhs: any, rhs: any, ctx: Context) {
  const impl = operators[token.operator]
  return impl(lhs, rhs, ctx)
}

function evalLiteralToken (token: LiteralToken) {
  return literalValues[token.literal]
}

function evalRangeToken (token: RangeToken, ctx: Context) {
  const low: number = evalToken(token.lhs, ctx)
  const high: number = evalToken(token.rhs, ctx)
  return range(+low, +high + 1)
}

function * toPostfix (tokens: IterableIterator<Token>): IterableIterator<Token> {
  const ops: OperatorToken[] = []
  for (const token of tokens) {
    if (TypeGuards.isOperatorToken(token)) {
      while (ops.length && ops[ops.length - 1].getPrecedence() > token.getPrecedence()) {
        yield ops.pop()!
      }
      ops.push(token)
    } else yield token
  }
  while (ops.length) {
    yield ops.pop()!
  }
}
