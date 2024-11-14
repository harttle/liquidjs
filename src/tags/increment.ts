import { isNumber, stringify } from '../util'
import { Tag, Liquid, TopLevelToken, Emitter, TagToken, Context } from '..'
import { StaticNode } from '../template'

export default class extends Tag {
  private variable: string
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.variable = this.tokenizer.readIdentifier().content
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

  public node (): StaticNode {
    return {
      token: this.token,
      values: [],
      children: [],
      blockScope: [],
      templateScope: [this.variable]
    }
  }
}
