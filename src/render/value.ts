import { toValue } from '../util/underscore'
import { Context } from '../context/context'
import { parseLiteral } from '../parser/literal'

export class Value {
  private str: string

  public constructor (str: string) {
    this.str = str
  }

  public async evaluate (ctx: Context) {
    return this.evaluateSync(ctx)
  }

  public evaluateSync (ctx: Context) {
    const literalValue = parseLiteral(this.str)
    if (literalValue !== undefined) {
      return literalValue
    }
    return ctx.get(this.str)
  }

  public async value (ctx: Context) {
    return toValue(await this.evaluate(ctx))
  }

  public valueSync (ctx: Context) {
    return toValue(this.evaluateSync(ctx))
  }
}
