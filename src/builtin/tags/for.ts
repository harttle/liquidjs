import { Emitter, TagToken, Token, Context, ITemplate, ITagImplOptions, ParseStream } from '../../types'
import { isString, isObject, isArray } from '../../util/underscore'
import { Expression } from '../../render/expression'
import { assert } from '../../util/assert'
import { identifier, value, hash } from '../../parser/lexical'
import { ForloopDrop } from '../../drop/forloop-drop'
import { Hash } from '../../template/tag/hash'

const re = new RegExp(`^(${identifier.source})\\s+in\\s+` +
  `(${value.source})` +
  `(?:\\s+${hash.source})*` +
  `(?:\\s+(reversed))?` +
  `(?:\\s+${hash.source})*$`)

export default {
  type: 'block',
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    const match = re.exec(tagToken.args) as RegExpExecArray
    assert(match, `illegal tag: ${tagToken.raw}`)
    this.variable = match[1]
    this.collection = match[2]
    this.reversed = !!match[3]

    this.templates = []
    this.elseTemplates = []

    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => (p = this.templates))
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endfor', () => stream.stop())
      .on('template', (tpl: ITemplate) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },
  render: async function (ctx: Context, hash: Hash, emitter: Emitter) {
    let collection = new Expression(this.collection).value(ctx)

    if (!isArray(collection)) {
      if (isString(collection) && collection.length > 0) {
        collection = [collection] as string[]
      } else if (isObject(collection)) {
        collection = Object.keys(collection).map((key) => [key, collection[key]])
      }
    }
    if (!isArray(collection) || !collection.length) {
      this.liquid.renderer.renderTemplates(this.elseTemplates, ctx, emitter)
      return
    }

    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    if (this.reversed) collection.reverse()

    const context = { forloop: new ForloopDrop(collection.length) }
    ctx.push(context)
    for (const item of collection) {
      context[this.variable] = item
      try {
        await this.liquid.renderer.renderTemplates(this.templates, ctx, emitter)
      } catch (e) {
        if (e.name !== 'RenderBreakError') throw e
        if (e.message === 'break') break
      }
      context.forloop.next()
    }
    ctx.pop()
  }
} as ITagImplOptions
