import { RenderError } from '../util/error'
import { Context } from '../context/context'
import { ITemplate } from '../template/itemplate'
import { Emitter } from './emitter'

export class Render {
  public async renderTemplates (templates: ITemplate[], ctx: Context, emitter = new Emitter()): Promise<string> {
    for (const tpl of templates) {
      try {
        const html = await tpl.render(ctx, emitter)
        html && emitter.write(html)
        if (emitter.break || emitter.continue) break
      } catch (e) {
        throw RenderError.is(e) ? e : new RenderError(e, tpl)
      }
    }
    return emitter.html
  }
  public renderTemplatesSync (templates: ITemplate[], ctx: Context, emitter = new Emitter()): string {
    for (const tpl of templates) {
      try {
        const html = tpl.renderSync(ctx, emitter)
        html && !(html instanceof Promise) && emitter.write(html)
        if (emitter.break || emitter.continue) break
      } catch (e) {
        throw RenderError.is(e) ? e : new RenderError(e, tpl)
      }
    }
    return emitter.html
  }
}
