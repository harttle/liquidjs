import { evalExp } from '../render/syntax'
import { FilterArgs, Filter } from './filter/filter'
import Context from '../context/context'

export default class Value {
  private strictFilters: boolean
  private initial: string
  private filters: Array<Filter> = []

  /**
   * @param str value string, like: "i have a dream | truncate: 3
   */
  constructor (str: string, strictFilters: boolean) {
    const tokens = Value.tokenize(str)
    this.strictFilters = strictFilters
    this.initial = tokens[0]
    this.parseFilters(tokens, 1)
  }
  private parseFilters (tokens: string[], begin: number) {
    let i = begin
    while (i < tokens.length) {
      if (tokens[i] !== '|') {
        i++
        continue
      }
      const j = ++i
      while (i < tokens.length && tokens[i] !== '|') i++
      this.parseFilter(tokens, j, i)
    }
  }
  private parseFilter (tokens: string[], begin: number, end: number) {
    const name = tokens[begin]
    const args: FilterArgs = []
    let argName, argValue
    for (let i = begin + 1; i < end + 1; i++) {
      if (i === end || tokens[i] === ',') {
        if (argName || argValue) {
          args.push(argName ? [argName, argValue] : <string>argValue)
        }
        argValue = argName = undefined
      } else if (tokens[i] === ':') {
        argName = argValue
        argValue = undefined
      } else if (argValue === undefined) {
        argValue = tokens[i]
      }
    }
    this.filters.push(new Filter(name, args, this.strictFilters))
  }
  async value (ctx: Context) {
    let val = await evalExp(this.initial, ctx)
    for (const filter of this.filters) {
      val = await filter.render(val, ctx)
    }
    return val
  }
  static tokenize (str: string): Array<'|' | ',' | ':' | string> {
    const tokens = []
    let i = 0
    while (i < str.length) {
      const ch = str[i]
      if (ch === '"' || ch === "'") {
        const j = i
        for (i += 2; i < str.length && str[i - 1] !== ch; ++i);
        tokens.push(str.slice(j, i))
      } else if (/\s/.test(ch)) {
        i++
      } else if (/[|,:]/.test(ch)) {
        tokens.push(str[i++])
      } else {
        const j = i++
        for (; i < str.length && !/[|,:\s]/.test(str[i]); ++i);
        tokens.push(str.slice(j, i))
      }
    }
    return tokens
  }
}
