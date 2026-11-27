import { QuotedToken, RangeToken, OperatorToken, Token, PropertyAccessToken, OperatorType, operatorTypes, FilteredValueToken } from '../tokens'
import { isRangeToken, isPropertyAccessToken, isFilteredValueToken, UndefinedVariableError, range, isOperatorToken, assert, toValue, isPromise, isIterator } from '../util'
import type { Context } from '../context'
import type { UnaryOperatorHandler } from '../render'
import { Drop } from '../drop'
import { Filter } from '../template/filter'

export class Expression {
  readonly postfix: Token[]

  public constructor (tokens: Iterable<Token>) {
    this.postfix = [...toPostfix(tokens)]
  }
  /**
   * Returns the value, or a generator that finishes the evaluation when a Promise or iterator is met.
   */
  public evaluate (ctx: Context, lenient?: boolean): unknown {
    assert(ctx, 'unable to evaluate: context not defined')
    if (this.postfix.length === 1) return evalToken(this.postfix[0], ctx, lenient)
    const operands: any[] = []
    for (let i = 0; i < this.postfix.length; i++) {
      const result = this.step(this.postfix[i], operands, ctx, lenient)
      if (isPromise(result) || isIterator(result)) return this.resume(result, operands, i + 1, ctx, lenient)
      operands.push(result)
    }
    return operands[0]
  }
  private * resume (pending: unknown, operands: any[], start: number, ctx: Context, lenient?: boolean): Generator<unknown, unknown, unknown> {
    operands.push(yield pending)
    for (let i = start; i < this.postfix.length; i++) {
      operands.push(yield this.step(this.postfix[i], operands, ctx, lenient))
    }
    return operands[0]
  }
  private step (token: Token, operands: any[], ctx: Context, lenient?: boolean): unknown {
    if (!isOperatorToken(token)) return evalToken(token, ctx, lenient)
    const r = operands.pop()
    if (operatorTypes[token.operator] === OperatorType.Unary) {
      return (ctx.opts.operators[token.operator] as UnaryOperatorHandler)(r, ctx)
    }
    const l = operands.pop()
    return ctx.opts.operators[token.operator](l, r, ctx)
  }
  public valid () {
    return !!this.postfix.length
  }
}

/**
 * Evaluate `token`, preserving Drops.
 * Operators use this so `Comparable` drops (`empty`, `nil`, `blank`) and custom drops
 * are compared as drops rather than as their `valueOf()` result.
 */
export function evalToken (token: Token | undefined, ctx: Context, lenient = false): unknown {
  if (!token) return
  if ('content' in token) return token.content
  if (isPropertyAccessToken(token)) return evalPropertyAccessToken(token, ctx, lenient)
  if (isRangeToken(token)) return evalRangeToken(token, ctx)
  if (isFilteredValueToken(token)) return evalFilteredValueToken(token, ctx, lenient)
}

function * evalFilteredValueToken (token: FilteredValueToken, ctx: Context, lenient: boolean): Generator<unknown, unknown, unknown> {
  assert(ctx.liquid, 'FilteredValueToken evaluation requires liquid instance in context')
  lenient = lenient || (ctx.opts.lenientIf && token.filters.length > 0 && token.filters[0].name === 'default')
  let val = yield token.initial.evaluate(ctx, lenient)

  for (const filterToken of token.filters) {
    const filterImpl = ctx.liquid.filters[filterToken.name]
    assert(filterImpl || !ctx.liquid.options.strictFilters, () => `undefined filter: ${filterToken.name}`)
    const filter = new Filter(filterToken, filterImpl, ctx.liquid)
    val = yield filter.render(val, ctx)
  }

  return val
}

/**
 * Evaluate `token` to the value filters and tags consume.
 * Awaits a promise returned by `Drop.valueOf()`.
 */
export function * evalTokenValue (token: Token | undefined, ctx: Context, lenient = false): Generator<unknown, unknown, unknown> {
  return yield toValue(yield evalToken(token, ctx, lenient))
}

function evalPropertyAccessToken (token: PropertyAccessToken, ctx: Context, lenient: boolean): unknown {
  if (!token.literalPath) return evalComputedPropertyAccessToken(token, ctx, lenient)
  try {
    const val = ctx._get(token.literalPath)
    return isIterator(val) ? catchUndefinedVariable(val, token, lenient) : val
  } catch (e) {
    return handleUndefinedVariable(e as Error, token, lenient)
  }
}

function * evalComputedPropertyAccessToken (token: PropertyAccessToken, ctx: Context, lenient: boolean): Generator<unknown, unknown, unknown> {
  const props: (string | number | Drop)[] = []
  for (const prop of token.props) {
    if ('content' in prop && !(prop.content instanceof Drop)) props.push(prop.content as string | number)
    else props.push((yield * evalTokenValue(prop, ctx, false)) as unknown as string | number | Drop)
  }
  try {
    if (token.variable) {
      const variable = yield evalToken(token.variable, ctx, lenient)
      return yield ctx._getFromScope(variable, props)
    } else {
      return yield ctx._get(props)
    }
  } catch (e) {
    return handleUndefinedVariable(e as Error, token, lenient)
  }
}

function * catchUndefinedVariable (lookup: unknown, token: PropertyAccessToken, lenient: boolean): Generator<unknown, unknown, unknown> {
  try {
    return yield lookup
  } catch (e) {
    return handleUndefinedVariable(e as Error, token, lenient)
  }
}

function handleUndefinedVariable (e: Error, token: PropertyAccessToken, lenient: boolean) {
  if (lenient && e.name === 'InternalUndefinedVariableError') return null
  throw (new UndefinedVariableError(e, token))
}

export function evalQuotedToken (token: QuotedToken) {
  return token.content
}

function * evalRangeToken (token: RangeToken, ctx: Context): Generator<unknown, unknown, unknown> {
  const low = Math.trunc((yield evalTokenValue(token.lhs, ctx)) as unknown as number)
  const high = Math.trunc((yield evalTokenValue(token.rhs, ctx)) as unknown as number)
  ctx.memoryLimit.use(high - low + 1)
  return range(low, high + 1)
}

function * toPostfix (tokens: Iterable<Token>): IterableIterator<Token> {
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
