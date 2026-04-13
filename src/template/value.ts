import { Filter } from './filter'
import { Expression } from '../render'
import { Tokenizer } from '../parser'
import { assert, isGroupedExpressionToken, isRangeToken, isPropertyAccessToken } from '../util'
import { FilteredValueToken, Token } from '../tokens'
import type { Liquid } from '../liquid'
import type { Context } from '../context'

function getFilter (liquid: Liquid, name: string) {
  const impl = liquid.filters[name]
  assert(impl || !liquid.options.strictFilters, () => `undefined filter: ${name}`)
  return impl
}

export function resolveGroupedExpressionFilters (token: Token, liquid: Liquid): void {
  if (isGroupedExpressionToken(token)) {
    for (const t of token.initial.postfix) {
      resolveGroupedExpressionFilters(t, liquid)
    }
    token.resolvedFilters = token.filters.map(filterToken =>
      new Filter(filterToken, getFilter(liquid, filterToken.name), liquid)
    )
  }
  if (isRangeToken(token)) {
    resolveGroupedExpressionFilters(token.lhs, liquid)
    resolveGroupedExpressionFilters(token.rhs, liquid)
  }
  if (isPropertyAccessToken(token)) {
    if (token.variable) resolveGroupedExpressionFilters(token.variable, liquid)
    for (const prop of token.props) resolveGroupedExpressionFilters(prop, liquid)
  }
}

export class Value {
  public readonly filters: Filter[] = []
  public readonly initial: Expression

  /**
   * @param str the value to be valuated, eg.: "foobar" | truncate: 3
   */
  public constructor (input: string | FilteredValueToken, liquid: Liquid) {
    const token: FilteredValueToken = typeof input === 'string'
      ? new Tokenizer(input, liquid.options.operators, undefined, undefined, liquid.options.groupedExpressions).readFilteredValue()
      : input
    this.initial = token.initial
    this.filters = token.filters.map(token => new Filter(token, getFilter(liquid, token.name), liquid))
    for (const t of this.initial.postfix) {
      resolveGroupedExpressionFilters(t, liquid)
    }
  }

  public * value (ctx: Context, lenient?: boolean): Generator<unknown, unknown, unknown> {
    lenient = lenient || (ctx.opts.lenientIf && this.filters.length > 0 && this.filters[0].name === 'default')
    let val = yield this.initial.evaluate(ctx, lenient)

    for (const filter of this.filters) {
      val = yield filter.render(val, ctx)
    }
    return val
  }
}
