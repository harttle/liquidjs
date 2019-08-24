import { RenderError } from '../util/error'
import assert from '../util/assert'
import Context from '../context/context'
import ITemplate from '../template/itemplate'
import { Emitter } from './emitter'

export default class Render {
  public async renderTemplates (templates: ITemplate[], ctx: Context) {
    assert(ctx, 'unable to evalTemplates: context undefined')

    const emitter = new Emitter()
    for (const tpl of templates) {
      try {
        emitter.write(await tpl.render(ctx, emitter))
      } catch (e) {
        if (e.name === 'RenderBreakError') {
          e.resolvedHTML = emitter.html
          throw e
        }
        throw e.name === 'RenderError' ? e : new RenderError(e, tpl)
      }
    }
    return emitter.html
  }
}
