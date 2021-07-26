import BlockMode from '../../context/block-mode'
import { BlockDrop } from '../../drop/block-drop'
import { ParseStream, TagToken, TopLevelToken, Template, Context, TagImpl, Emitter } from '../../types'

export default {
  parse (this: TagImpl, token: TagToken, remainTokens: TopLevelToken[]) {
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''
    this.tpls = [] as Template[]
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:endblock', () => stream.stop())
      .on('template', (tpl: Template) => this.tpls.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${token.getText()} not closed`)
      })
    stream.start()
  },

  * render (this: TagImpl, ctx: Context, emitter: Emitter) {
    const blockRender = this.getBlockRender(ctx)
    yield this.emitHTML(ctx, emitter, blockRender)
  },

  getBlockRender (this: TagImpl, ctx: Context) {
    const { liquid, tpls } = this
    const extendedBlockRender = ctx.getRegister('blocks')[this.block]
    const defaultBlockRender = function * (superBlock: BlockDrop) {
      ctx.push({ block: superBlock })
      const result = yield liquid.renderer.renderTemplates(tpls, ctx)
      ctx.pop()
      return result
    }
    return extendedBlockRender
      ? (superBlock: BlockDrop) => extendedBlockRender(new BlockDrop(() => defaultBlockRender(superBlock)))
      : defaultBlockRender
  },

  * emitHTML (this: TagImpl, ctx: Context, emitter: Emitter, blockRender: (block: BlockDrop) => string) {
    if (ctx.getRegister('blockMode', BlockMode.OUTPUT) === BlockMode.STORE) {
      ctx.getRegister('blocks')[this.block] = blockRender
    } else {
      emitter.write(yield blockRender(new BlockDrop()))
    }
  }
}
