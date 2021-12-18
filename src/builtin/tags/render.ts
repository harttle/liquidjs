import { __assign } from 'tslib'
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
    this['currentFile'] = token.file
    while (!tokenizer.end()) {
      tokenizer.skipBlank()
      const begin = tokenizer.p
      const keyword = tokenizer.readIdentifier()
      if (keyword.content === 'with' || keyword.content === 'for') {
        tokenizer.skipBlank()
        // can be normal key/value pair, like "with: true"
        if (tokenizer.peek() !== ':') {
          const value = tokenizer.readValue()
          // can be normal key, like "with,"
          if (value) {
            const beforeAs = tokenizer.p
            const asStr = tokenizer.readIdentifier()
            let alias
            if (asStr.content === 'as') alias = tokenizer.readIdentifier()
            else tokenizer.p = beforeAs

            this[keyword.content] = { value, alias: alias && alias.content }
            tokenizer.skipBlank()
            if (tokenizer.peek() === ',') tokenizer.advance()
            // matched!
            continue
          }
        }
      }
      /**
       * restore cursor if with/for not matched
       */
      tokenizer.p = begin
      break
    }
    this.hash = new Hash(tokenizer.remaining())
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const { liquid, hash } = this
    const filepath = yield this.renderFilePath(this['file'], ctx, liquid)
    assert(filepath, () => `illegal filename "${filepath}"`)

    const childCtx = new Context({}, ctx.opts, { sync: ctx.sync, globals: ctx.globals, strictVariables: ctx.strictVariables })
    const scope = childCtx.bottom()
    __assign(scope, yield hash.render(ctx))
    if (this['with']) {
      const { value, alias } = this['with']
      scope[alias || filepath] = evalToken(value, ctx)
    }

    if (this['for']) {
      const { value, alias } = this['for']
      let collection = evalToken(value, ctx)
      collection = toEnumerable(collection)
      scope['forloop'] = new ForloopDrop(collection.length, value.getText(), alias)
      for (const item of collection) {
        scope[alias] = item
        const templates = yield liquid._parsePartialFile(filepath, childCtx.sync, this['currentFile'])
        yield liquid.renderer.renderTemplates(templates, childCtx, emitter)
        scope['forloop'].next()
      }
    } else {
      const templates = yield liquid._parsePartialFile(filepath, childCtx.sync, this['currentFile'])
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
    if (TypeGuards.isQuotedToken(file)) {
      // for filenames like "files/{{file}}", eval as liquid template
      const templates = liquid.parse(evalQuotedToken(file))
      return optimize(templates)
    }
    return file
  }
  const tokens = [...tokenizer.readFileNameTemplate(liquid.options)]
  const templates = optimize(liquid.parser.parseTokens(tokens))
  return templates === 'none' ? null : templates
}

function optimize (templates: Template[]): string | Template[] {
  // for filenames like "files/file.liquid", extract the string directly
  if (templates.length === 1 && TypeGuards.isHTMLToken(templates[0].token)) return templates[0].token.getContent()
  return templates
}

export function renderFilePath (file: ParsedFileName, ctx: Context, liquid: Liquid) {
  if (typeof file === 'string') return file
  if (Array.isArray(file)) return liquid.renderer.renderTemplates(file, ctx)
  return evalToken(file, ctx)
}
