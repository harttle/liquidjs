import { Filter } from './filter'
import { Expression } from '../render'
import { Tokenizer } from '../parser'
import { assert, isPromise, isIterator } from '../util'
import type { FilteredValueToken } from '../tokens'
import type { Liquid } from '../liquid'
import type { Context } from '../context'

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
    this.filters = token.filters.map(token => new Filter(token, this.getFilter(liquid, token.name), liquid))
  }

  /**
   * Returns the value, or a generator that finishes the evaluation when a Promise or iterator is met.
   */
  public value (ctx: Context, lenient?: boolean): unknown {
    lenient = lenient || (ctx.opts.lenientIf && this.filters.length > 0 && this.filters[0].name === 'default')
    let val = this.initial.evaluate(ctx, lenient)
    for (let i = 0; i < this.filters.length; i++) {
      if (isPromise(val) || isIterator(val)) return this.resume(val, i, ctx)
      val = this.filters[i].render(val, ctx)
    }
    return val
  }
  private * resume (pending: unknown, start: number, ctx: Context): Generator<unknown, unknown, unknown> {
    let val = yield pending
    for (let i = start; i < this.filters.length; i++) {
      val = yield this.filters[i].render(val, ctx)
    }
    return val
  }

  private getFilter (liquid: Liquid, name: string) {
    const impl = liquid.filters[name]
    assert(impl || !liquid.options.strictFilters, () => `undefined filter: ${name}`)
    return impl
  }
}
