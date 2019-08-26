import { Expression } from '../render/expression'
import { FilterArgs, Filter } from './filter/filter'
import { Context } from '../context/context'

export class Value {
  private strictFilters: boolean
  private initial: string
  private filters: Filter[] = []

  /**
   * @param str value string, like: "i have a dream | truncate: 3
   */
  public constructor (str: string, strictFilters: boolean) {
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
          args.push(argName ? [argName, argValue] : argValue as string)
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
  public async value (ctx: Context) {
    let val = await new Expression(this.initial).evaluate(ctx)
    for (const filter of this.filters) {
      val = await filter.render(val, ctx)
    }
    return val
  }
  public valueSync (ctx: Context) {
    let val = new Expression(this.initial).evaluateSync(ctx)
    for (const filter of this.filters) {
      val = filter.renderSync(val, ctx)
    }
    return val
  }
  public static tokenize (str: string): ('|' | ',' | ':' | string)[] {
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
        let ch
        for (; i < str.length && !/[|,:\s]/.test(ch = str[i]); ++i) {
          if (ch === '"' || ch === "'") {
            for (i += 2; i < str.length && str[i - 1] !== ch; ++i);
          }
        }
        tokens.push(str.slice(j, i))
      }
    }
    return tokens
  }
}
