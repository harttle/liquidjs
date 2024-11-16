import { Value, Liquid, TopLevelToken, TagToken, Context, Tag } from '..'
import { Arguments } from '../template'

export default class extends Tag {
  private key: string
  private value: Value

  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.key = this.tokenizer.readIdentifier().content
    this.tokenizer.assert(this.key, 'expected variable name')

    this.tokenizer.skipBlank()
    this.tokenizer.assert(this.tokenizer.peek() === '=', 'expected "="')

    this.tokenizer.advance()
    this.value = new Value(this.tokenizer.readFilteredValue(), this.liquid)
  }
  * render (ctx: Context): Generator<unknown, void, unknown> {
    ctx.bottom()[this.key] = yield this.value.value(ctx, this.liquid.options.lenientIf)
  }

  public arguments (): Arguments {
    return [this.value]
  }

  public localScope (): string[] {
    return [this.key]
  }
}
