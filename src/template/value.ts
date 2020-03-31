import { evalToken } from '../render/expression'
import { Tokenizer } from '../parser/tokenizer'
import { FilterMap } from '../template/filter/filter-map'
import { Filter } from './filter/filter'
import { Context } from '../context/context'
import { ValueToken } from '../tokens/value-token'

export class Value {
  public readonly filters: Filter[] = []
  public readonly initial?: ValueToken

  /**
   * @param str the value to be valuated, eg.: "foobar" | truncate: 3
   */
  public constructor (str: string, private readonly filterMap: FilterMap) {
    const tokenizer = new Tokenizer(str)
    this.initial = tokenizer.readValue()
    this.filters = tokenizer.readFilters().map(({ name, args }) => new Filter(name, this.filterMap.get(name), args))
    tokenizer.skipBlank()
  }
  public * value (ctx: Context) {
    let val = yield evalToken(this.initial, ctx)
    for (const filter of this.filters) {
      val = yield filter.render(val, ctx)
    }
    return val
  }
}
