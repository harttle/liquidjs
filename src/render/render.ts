import { RenderError } from '../util/error'
import { Context } from '../context/context'
import { ITemplate } from '../template/itemplate'
import { Emitter } from './emitter'

export class Render {
  public async renderTemplates (templates: ITemplate[], ctx: Context, emitter = new Emitter()) {
    for (const tpl of templates) {
      try {
        await tpl.render(ctx, emitter)
      } catch (e) {
        if (e.name === 'RenderBreakError') throw e
        throw e.name === 'RenderError' ? e : new RenderError(e, tpl)
      }
    }
    return emitter.html
  }
}
