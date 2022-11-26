import { RangeToken, OperatorToken, Token, LiteralToken, NumberToken, PropertyAccessToken, QuotedToken } from '../tokens'
import { isQuotedToken, isWordToken, isNumberToken, isLiteralToken, isRangeToken, isPropertyAccessToken, UndefinedVariableError, range, isOperatorToken, literalValues, assert } from '../util'
import { parseStringLiteral } from '../parser'
import { Context } from '../context'
import { Operators } from '../render'

export class Expression {
  private postfix: Token[]

  public constructor (tokens: IterableIterator<Token>) {
    this.postfix = [...toPostfix(tokens)]
  }
  public * evaluate (ctx: Context, lenient?: boolean): Generator<unknown, unknown, unknown> {
    assert(ctx, 'unable to evaluate: context not defined')
    const operands: any[] = []
    for (const token of this.postfix) {
      if (isOperatorToken(token)) {
        const r = operands.pop()
        const l = operands.pop()
        const result = yield evalOperatorToken(ctx.opts.operators, token, l, r, ctx)
        operands.push(result)
      } else {
        operands.push(yield evalToken(token, ctx, lenient && this.postfix.length === 1))
      }
    }
    return operands[0]
  }
}

export function * evalToken (token: Token | undefined, ctx: Context, lenient = false): IterableIterator<unknown> {
  if (isPropertyAccessToken(token)) return yield evalPropertyAccessToken(token, ctx, lenient)
  if (isRangeToken(token)) return yield evalRangeToken(token, ctx)
  if (isLiteralToken(token)) return evalLiteralToken(token)
  if (isNumberToken(token)) return evalNumberToken(token)
  if (isWordToken(token)) return token.getText()
  if (isQuotedToken(token)) return evalQuotedToken(token)
}

function * evalPropertyAccessToken (token: PropertyAccessToken, ctx: Context, lenient: boolean): IterableIterator<unknown> {
  const props: string[] = []
  for (const prop of token.props) {
    props.push((yield evalToken(prop, ctx, false)) as unknown as string)
  }
  try {
    return yield ctx._get([token.propertyName, ...props])
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

function * evalRangeToken (token: RangeToken, ctx: Context) {
  const low: number = yield evalToken(token.lhs, ctx)
  const high: number = yield evalToken(token.rhs, ctx)
  return range(+low, +high + 1)
}

function * toPostfix (tokens: IterableIterator<Token>): IterableIterator<Token> {
  const ops: OperatorToken[] = []
  for (const token of tokens) {
    if (isOperatorToken(token)) {
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
