import { isNumber, stringify } from '../util'
import { Tag, Liquid, TopLevelToken, Tokenizer, Emitter, TagToken, Context } from '..'

export default class extends Tag {
  private variable: string
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operators)
    this.variable = tokenizer.readIdentifier().content
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
}
