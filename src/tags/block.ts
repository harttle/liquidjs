import { BlockMode } from '../context'
import { isTagToken } from '../util'
import { BlockDrop } from '../drop'
import { Liquid, TagToken, TopLevelToken, Template, Context, Emitter, Tag } from '..'

export default class extends Tag {
  block: string
  templates: Template[] = []
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''
    while (remainTokens.length) {
      const token = remainTokens.shift()!
      if (isTagToken(token) && token.name === 'endblock') return
      const template = liquid.parser.parseToken(token, remainTokens)
      this.templates.push(template)
    }
    throw new Error(`tag ${token.getText()} not closed`)
  }

  * render (ctx: Context, emitter: Emitter) {
    const blockRender = this.getBlockRender(ctx)
    if (ctx.getRegister('blockMode') === BlockMode.STORE) {
      ctx.getRegister('blocks')[this.block] = blockRender
    } else {
      yield blockRender(new BlockDrop(), emitter)
    }
  }

  private getBlockRender (ctx: Context) {
    const { liquid, templates } = this
    const renderChild = ctx.getRegister('blocks')[this.block]
    const renderCurrent = function * (superBlock: BlockDrop, emitter: Emitter) {
      // add {{ block.super }} support when rendering
      ctx.push({ block: superBlock })
      yield liquid.renderer.renderTemplates(templates, ctx, emitter)
      ctx.pop()
    }
    return renderChild
      ? (superBlock: BlockDrop, emitter: Emitter) => renderChild(new BlockDrop(() => renderCurrent(superBlock, emitter)), emitter)
      : renderCurrent
  }
}
