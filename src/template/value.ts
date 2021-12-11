import { Expression } from '../render/expression'
import { Tokenizer } from '../parser/tokenizer'
import { Filter } from './filter/filter'
import { Context } from '../context/context'
import { Liquid } from '../liquid'

export class Value {
  public readonly filters: Filter[] = []
  public readonly initial: Expression

  /**
   * @param str the value to be valuated, eg.: "foobar" | truncate: 3
   */
  public constructor (str: string, liquid: Liquid) {
    const tokenizer = new Tokenizer(str, liquid.options.operatorsTrie)
    this.initial = tokenizer.readExpression()
    this.filters = tokenizer.readFilters().map(({ name, args }) => new Filter(name, liquid.filters.get(name), args, liquid))
  }
  public * value (ctx: Context, lenient: boolean): Generator<unknown, unknown, unknown> {
    lenient = lenient || (ctx.opts.lenientIf && this.filters.length > 0 && this.filters[0].name === 'default')
    let val = yield this.initial.evaluate(ctx, lenient)

    for (const filter of this.filters) {
      val = yield filter.render(val, ctx)
    }
    return val
  }
}
