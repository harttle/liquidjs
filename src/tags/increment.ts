import { isNumber, stringify } from '../util'
import { Tag, Liquid, TopLevelToken, Emitter, TagToken, Context } from '..'
import { IdentifierToken } from '../tokens'

export default class extends Tag {
  private identifier: IdentifierToken
  private variable: string
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.identifier = this.tokenizer.readIdentifier()
    this.variable = this.identifier.content
  }
  render (context: Context, emitter: Emitter) {
    const scope = context.environments
    if (!isNumber(scope[this.variable])) {
      scope[this.variable] = 0
    }
    const val = scope[this.variable]
    scope[this.variable]++
    emitter.write(stringify(val))
  }

  public * localScope (): Iterable<string | IdentifierToken> {
    yield this.identifier
  }
}
