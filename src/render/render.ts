import { RenderBreakError, RenderError } from 'src/util/error'
import assert from 'src/util/assert'

export default class Render {
  async renderTemplates (templates, scope) {
    assert(scope, 'unable to evalTemplates: scope undefined')

    let html = ''
    for (const tpl of templates) {
      try {
        html += await tpl.render(scope)
      } catch (e) {
        if (e instanceof RenderBreakError) {
          e.resolvedHTML = html
          throw e
        }
        throw e instanceof RenderError ? e : new RenderError(e, tpl)
      }
    }
    return html
  }
}
