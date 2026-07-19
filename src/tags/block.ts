import { BlockMode } from '../context'
import { isTagToken } from '../util'
import { BlockDrop } from '../drop'
import { Liquid, TagToken, TopLevelToken, Template, Context, Emitter, Tag } from '..'
import { Parser } from '../parser'

export default class extends Tag {
  block: string
  templates: Template[] = []
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(token, remainTokens, liquid)
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''
    while (remainTokens.length) {
      const token = remainTokens.shift()!
      if (isTagToken(token) && token.name === 'endblock') return
      const template = parser.parseToken(token, remainTokens)
      this.templates.push(template)
    }
    throw new Error(`tag ${token.getText()} not closed`)
  }

  * render (ctx: Context, emitter: Emitter) {
    const blockRender = this.getBlockRender(ctx)
    if (ctx.getRegister('blockMode') === BlockMode.STORE) {
      ctx.getRegister('blocks', {} as Record<string, any>)[this.block] = blockRender
    } else {
      yield blockRender(new BlockDrop(), emitter)
    }
  }

  private getBlockRender (ctx: Context) {
    const self = this as Tag
    const { liquid, templates } = this
    const renderChild = ctx.getRegister('blocks', {} as Record<string, any>)[this.block]
    const renderCurrent = function * (superBlock: BlockDrop, emitter: Emitter) {
      const stack: Tag[] = ctx.getRegister('blockStack', [])
      if (stack.includes(self)) throw new Error('block tag cannot be nested')

      stack.push(self)
      ctx.push({ block: superBlock })
      yield liquid.renderer.renderTemplates(templates, ctx, emitter)
      ctx.pop()
      stack.pop()
    }
    return renderChild
      ? (superBlock: BlockDrop, emitter: Emitter) => renderChild(
        new BlockDrop(
          (emitter: Emitter) => renderCurrent(superBlock, emitter)
        ),
        emitter)
      : renderCurrent
  }

  public * children (): Generator<unknown, Template[]> {
    return this.templates
  }

  public blockScope (): Iterable<string> {
    return ['block']
  }
}
