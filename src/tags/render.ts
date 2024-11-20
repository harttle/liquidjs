import { __assign } from 'tslib'
import { ForloopDrop } from '../drop'
import { isString, isValueToken, toEnumerable, toValueSync } from '../util'
import { TopLevelToken, assert, Liquid, Token, Template, evalQuotedToken, TypeGuards, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, Tag } from '..'
import { Parser } from '../parser'
import { Arguments, PartialScope } from '../template'

export type ParsedFileName = Template[] | Token | string | undefined

export default class extends Tag {
  private file: ParsedFileName
  private currentFile?: string
  private hash: Hash
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(token, remainTokens, liquid)
    const tokenizer = this.tokenizer
    this.file = parseFilePath(tokenizer, this.liquid, parser)
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
    this.hash = new Hash(tokenizer.remaining(), liquid.options.keyValueSeparator)
  }
  * render (ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const { liquid, hash } = this
    const filepath = (yield renderFilePath(this['file'], ctx, liquid)) as string
    assert(filepath, () => `illegal file path "${filepath}"`)

    const childCtx = ctx.spawn()
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

  public children (partials: boolean): Iterable<Template> {
    if (partials && isString(this['file'])) {
      // TODO: async
      // TODO: throw error if this.file does not exist?
      return toValueSync(this.liquid._parsePartialFile(this['file'], true, this['currentFile']))
    }

    // XXX: We're silently ignoring dynamically named partial templates.
    return []
  }

  public partialScope (): PartialScope | undefined {
    if (isString(this['file'])) {
      const names = Object.keys(this.hash.hash)

      if (this['for']) {
        const { alias } = this['for']
        if (isString(alias)) {
          names.push(alias)
        } else if (isString(this.file)) {
          names.push(this.file)
        }
      }

      return { name: this['file'], isolated: true, scope: names }
    }
  }

  public * arguments (): Arguments {
    for (const v of Object.values(this.hash.hash)) {
      if (isValueToken(v)) {
        yield v
      }
    }

    if (isValueToken(this['file'])) {
      yield this['file']
    }

    if (this['for']) {
      const { value } = this['for']
      if (isValueToken(value)) {
        yield value
      }
    }
  }
}

/**
 * @return null for "none",
 * @return Template[] for quoted with tags and/or filters
 * @return Token for expression (not quoted)
 * @throws TypeError if cannot read next token
 */
export function parseFilePath (tokenizer: Tokenizer, liquid: Liquid, parser: Parser): ParsedFileName {
  if (liquid.options.dynamicPartials) {
    const file = tokenizer.readValue()
    tokenizer.assert(file, 'illegal file path')
    if (file!.getText() === 'none') return
    if (TypeGuards.isQuotedToken(file)) {
      // for filenames like "files/{{file}}", eval as liquid template
      const templates = parser.parse(evalQuotedToken(file))
      return optimize(templates)
    }
    return file
  }
  const tokens = [...tokenizer.readFileNameTemplate(liquid.options)]
  const templates = optimize(parser.parseTokens(tokens))
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
