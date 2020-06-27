import { assert } from '../../util/assert'
import { ForloopDrop } from '../../drop/forloop-drop'
import { toEnumerable } from '../../util/collection'
import { evalQuotedToken, TypeGuards, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'

export default {
  parse: function (token: TagToken) {
    const args = token.args
    const tokenizer = new Tokenizer(args)
    this.file = this.liquid.options.dynamicPartials
      ? tokenizer.readValue()
      : tokenizer.readFileName()
    assert(this.file, () => `illegal argument "${token.args}"`)

    while (!tokenizer.end()) {
      tokenizer.skipBlank()
      const begin = tokenizer.p
      const keyword = tokenizer.readWord()
      if (keyword.content === 'with' || keyword.content === 'for') {
        tokenizer.skipBlank()
        if (tokenizer.peek() !== ':') {
          const value = tokenizer.readValue()
          if (value) {
            const beforeAs = tokenizer.p
            const asStr = tokenizer.readWord()
            let alias
            if (asStr.content === 'as') alias = tokenizer.readWord()
            else tokenizer.p = beforeAs

            this[keyword.content] = { value, alias: alias && alias.content }
            tokenizer.skipBlank()
            if (tokenizer.peek() === ',') tokenizer.advance()
            continue
          }
        }
      }
      tokenizer.p = begin
      break
    }
    this.hash = new Hash(tokenizer.remaining())
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, file, hash } = this
    const { renderer } = liquid
    const filepath = ctx.opts.dynamicPartials
      ? (TypeGuards.isQuotedToken(file)
        ? yield renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)
        : evalToken(file, ctx))
      : file.getText()
    assert(filepath, () => `illegal filename "${file.getText()}":"${filepath}"`)

    const childCtx = new Context({}, ctx.opts, ctx.sync)
    const scope = yield hash.render(ctx)
    if (this['with']) {
      const { value, alias } = this['with']
      scope[alias || filepath] = evalToken(value, ctx)
    }
    childCtx.push(scope)

    if (this['for']) {
      const { value, alias } = this['for']
      let collection = evalToken(value, ctx)
      collection = yield toEnumerable(collection)
      scope['forloop'] = new ForloopDrop(collection.length)
      for (const item of collection) {
        scope[alias] = item
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
