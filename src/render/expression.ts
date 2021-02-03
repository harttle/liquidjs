import { QuotedToken } from '../tokens/quoted-token'
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
import { range, toValue } from '../util/underscore'
import { Tokenizer } from '../parser/tokenizer'
import { Operators } from '../render/operator'
import { UndefinedVariableError, InternalUndefinedVariableError } from '../util/error'
import { Trie } from '../util/operator-trie'

export class Expression {
  private operands: any[] = []
  private postfix: Token[]
  private lenient: boolean
  private operators: Operators

  public constructor (str: string, operators: Operators, operatorsTrie: Trie, lenient = false) {
    const tokenizer = new Tokenizer(str, operatorsTrie)
    this.postfix = [...toPostfix(tokenizer.readExpression())]
    this.lenient = lenient
    this.operators = operators
  }
  public evaluate (ctx: Context): any {
    for (const token of this.postfix) {
      if (TypeGuards.isOperatorToken(token)) {
        const r = this.operands.pop()
        const l = this.operands.pop()
        const result = evalOperatorToken(this.operators, token, l, r, ctx)
        this.operands.push(result)
      } else {
        this.operands.push(evalToken(token, ctx, this.lenient && this.postfix.length === 1))
      }
    }
    return this.operands[0]
  }
  public * value (ctx: Context) {
    return toValue(this.evaluate(ctx))
  }
}

export function evalToken (token: Token | undefined, ctx: Context, lenient = false): any {
  assert(ctx, () => 'unable to evaluate: context not defined')
  if (TypeGuards.isPropertyAccessToken(token)) {
    const variable = token.getVariableAsText()
    const props: string[] = token.props.map(prop => evalToken(prop, ctx))
    try {
      return ctx.get([variable, ...props])
    } catch (e) {
      if (lenient && e instanceof InternalUndefinedVariableError) {
        return null
      } else {
        throw (new UndefinedVariableError(e, token))
      }
    }
  }
  if (TypeGuards.isRangeToken(token)) return evalRangeToken(token, ctx)
  if (TypeGuards.isLiteralToken(token)) return evalLiteralToken(token)
  if (TypeGuards.isNumberToken(token)) return evalNumberToken(token)
  if (TypeGuards.isWordToken(token)) return token.getText()
  if (TypeGuards.isQuotedToken(token)) return evalQuotedToken(token)
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
