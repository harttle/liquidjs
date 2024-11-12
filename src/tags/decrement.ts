import { Tag, Liquid, TopLevelToken, Emitter, TagToken, Context } from '..'
import { MetaNode } from '../template/node'
import { isNumber, stringify } from '../util'

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
    emitter.write(stringify(--scope[this.variable]))
  }

  public node (): MetaNode {
    return {
      token: this.token,
      values: [],
      children: [],
      blockScope: [],
      templateScope: [this.variable]
    }
  }
}
