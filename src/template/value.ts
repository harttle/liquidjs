import { evalToken } from '../render/expression'
import { Tokenizer } from '../parser/tokenizer'
import { FilterMap } from '../template/filter/filter-map'
import { Filter } from './filter/filter'
import { Context } from '../context/context'
import { ValueToken } from '../tokens/value-token'
import { Liquid } from '../liquid'

export class Value {
  public readonly filters: Filter[] = []
  public readonly initial?: ValueToken

  /**
   * @param str the value to be valuated, eg.: "foobar" | truncate: 3
   */
  public constructor (str: string, private readonly filterMap: FilterMap, liquid: Liquid) {
    const tokenizer = new Tokenizer(str, liquid.options.operatorsTrie)
    this.initial = tokenizer.readValue()
    this.filters = tokenizer.readFilters().map(({ name, args }) => new Filter(name, this.filterMap.get(name), args, liquid))
  }
  public * value (ctx: Context) {
    const lenient = ctx.opts.lenientIf && this.filters.length > 0 && this.filters[0].name === 'default'

    let val = yield evalToken(this.initial, ctx, lenient)
    for (const filter of this.filters) {
      val = yield filter.render(val, ctx)
    }
    return val
  }
}
