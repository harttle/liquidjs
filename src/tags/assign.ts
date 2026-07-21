import { Value, Liquid, TopLevelToken, TagToken, Context, Tag } from '..'
import { Arguments } from '../template'
import { IdentifierToken } from '../tokens'

export default class extends Tag {
  private key: string
  private value: Value
  private identifier: IdentifierToken

  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.identifier = this.tokenizer.readIdentifier()
    this.key = this.identifier.content
    this.tokenizer.assert(this.key, 'expected variable name')

    this.tokenizer.skipBlank()
    this.tokenizer.assert(this.tokenizer.peek() === '=', 'expected "="')

    this.tokenizer.advance()
    this.value = new Value(this.tokenizer.readFilteredValue(), this.liquid)
  }
  * render (ctx: Context): Generator<unknown, void, unknown> {
    ctx.bottom()[this.key] = yield this.value.value(ctx, this.liquid.options.lenientIf)
  }

  public * arguments (): Arguments {
    yield this.value
  }

  public * localScope (): Iterable<IdentifierToken> {
    yield this.identifier
  }
}
