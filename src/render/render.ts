import { RenderBreakError, RenderError } from 'src/util/error'
import assert from 'src/util/assert'
import Scope from 'src/scope/scope';
import ITemplate from 'src/template/itemplate';

export default class Render {
  async renderTemplates (templates: ITemplate[], scope: Scope) {
    assert(scope, 'unable to evalTemplates: scope undefined')

    let html = ''
    for (const tpl of templates) {
      try {
        html += await tpl.render(scope)
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
