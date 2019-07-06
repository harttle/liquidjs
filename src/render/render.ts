import { RenderError } from '../util/error'
import assert from '../util/assert'
import Context from '../context/context'
import ITemplate from '../template/itemplate'

export default class Render {
  public async renderTemplates (templates: ITemplate[], ctx: Context) {
    assert(ctx, 'unable to evalTemplates: context undefined')

    let html = ''
    for (const tpl of templates) {
      try {
        html += await tpl.render(ctx)
      } catch (e) {
        if (e.name === 'RenderBreakError') {
          e.resolvedHTML = html
          throw e
        }
        throw e.name === 'RenderError' ? e : new RenderError(e, tpl)
      }
    }
    return html
  }
}
