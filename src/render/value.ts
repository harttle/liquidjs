import { toValue } from '../util/underscore'
import { Context } from '../context/context'
import { parseLiteral } from '../parser/literal'

export class Value {
  private str: string

  public constructor (str: string) {
    this.str = str
  }

  public evaluate (ctx: Context) {
    const literalValue = parseLiteral(this.str)
    if (literalValue !== undefined) {
      return literalValue
    }
    return ctx.get(this.str)
  }

  public value (ctx: Context) {
    return toValue(this.evaluate(ctx))
  }
}
