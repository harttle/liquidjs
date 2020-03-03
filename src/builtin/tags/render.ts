import { assert } from '../../util/assert'
import { ForloopDrop } from '../../drop/forloop-drop'
import { toCollection } from '../../util/collection'
import { Expression, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'
import { identifier, value, quoted, quotedLine } from '../../parser/lexical'

const rFile = new RegExp(`^(${quoted.source}|[^\\s,]+)`)
const rWith = new RegExp(`^\\s+with\\s+(${value.source})(?:\\s+as\\s+(${identifier.source}))?`)
const rFor = new RegExp(`^\\s+for\\s+(${value.source})\\s+as\\s+(${identifier.source})`)

export default {
  parse: function (token: TagToken) {
    let args = token.args
    let match = rFile.exec(args)

    assert(match, `illegal argument "${token.args}"`)
    this.file = match![1]
    args = args.substr(match![0].length)

    while (true) {
      if ((match = rWith.exec(args))) {
        this.withVar = match[1]
        this.withAs = match[2]
        args = args.substr(match[0].length)
      } else if ((match = rFor.exec(args))) {
        this.forVar = match[1]
        this.forAs = match[2]
        args = args.substr(match[0].length)
      } else break
    }
    this.hash = new Hash(args)
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, withVar, withAs, forVar, forAs, file, hash } = this
    const { renderer } = liquid
    const filepath = ctx.opts.dynamicPartials
      ? (quotedLine.exec(file)
        ? yield renderer.renderTemplates(liquid.parse(file.slice(1, -1)), ctx)
        : yield new Expression(file).value(ctx))
      : this.file
    assert(filepath, `illegal filename "${file}":"${filepath}"`)

    const childCtx = new Context({}, ctx.opts, ctx.sync)
    const scope = yield hash.render(ctx)
    if (withVar) scope[withAs || filepath] = yield new Expression(withVar).evaluate(ctx)
    childCtx.push(scope)

    if (forVar) {
      let collection = yield new Expression(forVar).value(ctx)
      collection = toCollection(collection)
      scope['forloop'] = new ForloopDrop(collection.length)
      for (const item of collection) {
        scope[forAs] = item
        const templates = yield liquid._parseFile(filepath, childCtx.opts, childCtx.sync)
        yield renderer.renderTemplates(templates, childCtx, emitter)
        scope.forloop.next()
      }
    } else {
      const templates = yield liquid._parseFile(filepath, childCtx.opts, childCtx.sync)
      yield renderer.renderTemplates(templates, childCtx, emitter)
    }
  }
} as TagImplOptions
