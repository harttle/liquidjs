import { toPromise, RenderError, LiquidErrors, LiquidError } from '../util'
import { Context } from '../context'
import { Template } from '../template'
import { Emitter, StreamedEmitter, SimpleEmitter } from '../emitters'

export class Render {
  public renderTemplatesToNodeStream (templates: Template[], ctx: Context): NodeJS.ReadableStream {
    const emitter = new StreamedEmitter(ctx.outputLengthLimit)
    Promise.resolve().then(() => toPromise(this.renderTemplates(templates, ctx, emitter)))
      .then(() => emitter.end(), err => emitter.error(err))
    return emitter.stream
  }
  public * renderTemplates (templates: Template[], ctx: Context, emitter: Emitter = new SimpleEmitter(ctx.outputLengthLimit)): IterableIterator<any> {
    const errors = []
    for (const tpl of templates) {
      ctx.templateLimit.use(1)
      try {
        const html = yield tpl.render(ctx, emitter)
        html && emitter.write(html)
        if (ctx.breakCalled || ctx.continueCalled) break
      } catch (e) {
        const err = LiquidError.is(e) ? e : new RenderError(e as Error, tpl)
        if (ctx.opts.catchAllErrors) errors.push(err)
        else throw err
      }
    }
    if (errors.length) {
      throw new LiquidErrors(errors)
    }
    return emitter.buffer
  }
}
