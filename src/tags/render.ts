import { __assign } from 'tslib'
import { ForloopDrop } from '../drop'
import { toEnumerable } from '../util'
import { TopLevelToken, assert, Liquid, Token, Template, evalQuotedToken, TypeGuards, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, Tag } from '..'

export type ParsedFileName = Template[] | Token | string | undefined

export default class extends Tag {
  private file: ParsedFileName
  private currentFile?: string
  private hash: Hash
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    const args = token.args
    const tokenizer = new Tokenizer(args, this.liquid.options.operators)
    this.file = parseFilePath(tokenizer, this.liquid)
    this.currentFile = token.file
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
            continue // matched!
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
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const { liquid, hash } = this
    const filepath = (yield renderFilePath(this['file'], ctx, liquid)) as string
    assert(filepath, () => `illegal filename "${filepath}"`)

    const childCtx = new Context({}, ctx.opts, { sync: ctx.sync, globals: ctx.globals, strictVariables: ctx.strictVariables })
    const scope = childCtx.bottom()
    __assign(scope, yield hash.render(ctx))
    if (this['with']) {
      const { value, alias } = this['with']
      scope[alias || filepath] = yield evalToken(value, ctx)
    }

    if (this['for']) {
      const { value, alias } = this['for']
      const collection = toEnumerable(yield evalToken(value, ctx))
      scope['forloop'] = new ForloopDrop(collection.length, value.getText(), alias)
      for (const item of collection) {
        scope[alias] = item
        const templates = (yield liquid._parsePartialFile(filepath, childCtx.sync, this['currentFile'])) as Template[]
        yield liquid.renderer.renderTemplates(templates, childCtx, emitter)
        scope['forloop'].next()
      }
    } else {
      const templates = (yield liquid._parsePartialFile(filepath, childCtx.sync, this['currentFile'])) as Template[]
      yield liquid.renderer.renderTemplates(templates, childCtx, emitter)
    }
  }
}

/**
 * @return null for "none",
 * @return Template[] for quoted with tags and/or filters
 * @return Token for expression (not quoted)
 * @throws TypeError if cannot read next token
 */
export function parseFilePath (tokenizer: Tokenizer, liquid: Liquid): ParsedFileName {
  if (liquid.options.dynamicPartials) {
    const file = tokenizer.readValue()
    if (file === undefined) throw new TypeError(`illegal argument "${tokenizer.input}"`)
    if (file.getText() === 'none') return
    if (TypeGuards.isQuotedToken(file)) {
      // for filenames like "files/{{file}}", eval as liquid template
      const templates = liquid.parse(evalQuotedToken(file))
      return optimize(templates)
    }
    return file
  }
  const tokens = [...tokenizer.readFileNameTemplate(liquid.options)]
  const templates = optimize(liquid.parser.parseTokens(tokens))
  return templates === 'none' ? undefined : templates
}

function optimize (templates: Template[]): string | Template[] {
  // for filenames like "files/file.liquid", extract the string directly
  if (templates.length === 1 && TypeGuards.isHTMLToken(templates[0].token)) return templates[0].token.getContent()
  return templates
}

export function * renderFilePath (file: ParsedFileName, ctx: Context, liquid: Liquid): IterableIterator<unknown> {
  if (typeof file === 'string') return file
  if (Array.isArray(file)) return liquid.renderer.renderTemplates(file, ctx)
  return yield evalToken(file, ctx)
}
