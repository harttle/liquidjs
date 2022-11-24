import { Tag, Liquid, TopLevelToken, Tokenizer, Emitter, TagToken, Context } from '..'
import { isNumber, stringify } from '../util'

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
    emitter.write(stringify(--scope[this.variable]))
  }
}
