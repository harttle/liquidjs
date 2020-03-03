import { Emitter, TagToken, Token, Context, Template, TagImplOptions, ParseStream } from '../../types'
import { toCollection } from '../../util/collection'
import { Expression } from '../../render/expression'
import { assert } from '../../util/assert'
import { identifier, value } from '../../parser/lexical'
import { ForloopDrop } from '../../drop/forloop-drop'
import { Hash } from '../../template/tag/hash'

const re = new RegExp(`^(${identifier.source})\\s+in\\s+(${value.source})`)

export default {
  type: 'block',
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    const match = re.exec(tagToken.args) as RegExpExecArray
    assert(match, `illegal tag: ${tagToken.raw}`)
    this.variable = match[1]
    this.collection = match[2]
    this.hash = new Hash(tagToken.args.slice(match[0].length))
    this.templates = []
    this.elseTemplates = []

    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => (p = this.templates))
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endfor', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer
    let collection = yield new Expression(this.collection).value(ctx)
    collection = toCollection(collection)

    if (!collection.length) {
      yield r.renderTemplates(this.elseTemplates, ctx, emitter)
      return
    }

    const hash = yield this.hash.render(ctx)
    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    if ('reversed' in hash) collection.reverse()

    const scope = { forloop: new ForloopDrop(collection.length) }
    ctx.push(scope)
    for (const item of collection) {
      scope[this.variable] = item
      yield r.renderTemplates(this.templates, ctx, emitter)
      if (emitter.break) {
        emitter.break = false
        break
      }
      emitter.continue = false
      scope.forloop.next()
    }
    ctx.pop()
  }
} as TagImplOptions
