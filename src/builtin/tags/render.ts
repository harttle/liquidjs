import { assert } from '../../util/assert'
import { ForloopDrop } from '../../drop/forloop-drop'
import { toEnumerable } from '../../util/collection'
import { Liquid } from '../../liquid'
import { Token, Template, evalQuotedToken, TypeGuards, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, TagImplOptions } from '../../types'

export default {
  parseFilePath,
  renderFilePath,
  parse: function (token: TagToken) {
    const args = token.args
    const tokenizer = new Tokenizer(args, this.liquid.options.operatorsTrie)
    this['file'] = this.parseFilePath(tokenizer, this.liquid)

    while (!tokenizer.end()) {
      tokenizer.skipBlank()
      const begin = tokenizer.p
      const keyword = tokenizer.readIdentifier()
      if (keyword.content === 'with' || keyword.content === 'for') {
        tokenizer.skipBlank()
        if (tokenizer.peek() !== ':') {
          const value = tokenizer.readValue()
          if (value) {
            const beforeAs = tokenizer.p
            const asStr = tokenizer.readIdentifier()
            let alias
            if (asStr.content === 'as') alias = tokenizer.readIdentifier()
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
    const { liquid, hash } = this
    const filepath = yield this.renderFilePath(this['file'], ctx, liquid)
    assert(filepath, () => `illegal filename "${filepath}"`)

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
      collection = toEnumerable(collection)
      scope['forloop'] = new ForloopDrop(collection.length)
      for (const item of collection) {
        scope[alias] = item
        const templates = yield liquid.parseFileImpl(filepath, childCtx.sync)
        yield liquid.renderer.renderTemplates(templates, childCtx, emitter)
        scope.forloop.next()
      }
    } else {
      const templates = yield liquid.parseFileImpl(filepath, childCtx.sync)
      yield liquid.renderer.renderTemplates(templates, childCtx, emitter)
    }
  }
} as TagImplOptions

type ParsedFileName = Template[] | Token | string | undefined

/**
 * @return null for "none",
 * @return Template[] for quoted with tags and/or filters
 * @return Token for expression (not quoted)
 * @throws TypeError if cannot read next token
 */
export function parseFilePath (tokenizer: Tokenizer, liquid: Liquid): ParsedFileName | null {
  if (liquid.options.dynamicPartials) {
    const file = tokenizer.readValue()
    if (file === undefined) throw new TypeError(`illegal argument "${tokenizer.input}"`)
    if (file.getText() === 'none') return null
    // for filenames like "files/{{file}}", eval as liquid template
    if (TypeGuards.isQuotedToken(file)) {
      const tpls = liquid.parse(evalQuotedToken(file))
      // for filenames like "files/file.liquid", extract the string directly
      if (tpls.length === 1) {
        const first = tpls[0]
        if (TypeGuards.isHTMLToken(first)) return first.getText()
      }
      return tpls
    }
    return file
  }
  const filepath = tokenizer.readFileName().getText()
  return filepath === 'none' ? null : filepath
}

export function renderFilePath (file: ParsedFileName, ctx: Context, liquid: Liquid) {
  if (typeof file === 'string') return file
  if (Array.isArray(file)) return liquid.renderer.renderTemplates(file, ctx)
  return evalToken(file, ctx)
}
