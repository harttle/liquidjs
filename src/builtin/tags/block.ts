import BlockMode from '../../context/block-mode'
import { BlockDrop } from '../../drop/block-drop'
import { TagToken, TopLevelToken, Template, Context, TagImpl, Emitter } from '../../types'

export default {
  parse (this: TagImpl, token: TagToken, remainTokens: TopLevelToken[]) {
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''
    this.tpls = [] as Template[]
    this.liquid.parser.parseStream(remainTokens)
      .on('tag:endblock', function () { this.stop() })
      .on('template', (tpl: Template) => this.tpls.push(tpl))
      .on('end', () => { throw new Error(`tag ${token.getText()} not closed`) })
      .start()
  },

  * render (this: TagImpl, ctx: Context, emitter: Emitter) {
    const blockRender = this.getBlockRender(ctx)
    if (ctx.getRegister('blockMode') === BlockMode.STORE) {
      ctx.getRegister('blocks')[this.block] = blockRender
    } else {
      yield blockRender(new BlockDrop(), emitter)
    }
  },

  getBlockRender (this: TagImpl, ctx: Context) {
    const { liquid, tpls } = this
    const renderChild = ctx.getRegister('blocks')[this.block]
    const renderCurrent = function * (superBlock: BlockDrop, emitter: Emitter) {
      // add {{ block.super }} support when rendering
      ctx.push({ block: superBlock })
      yield liquid.renderer.renderTemplates(tpls, ctx, emitter)
      ctx.pop()
    }
    return renderChild
      ? (superBlock: BlockDrop, emitter: Emitter) => renderChild(new BlockDrop(() => renderCurrent(superBlock, emitter)), emitter)
      : renderCurrent
  }
}
