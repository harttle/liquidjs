import { isString, isObject, isArray } from '../../util/underscore'
import { evalExp } from '../../render/syntax'
import assert from '../../util/assert'
import { identifier, value, hash } from '../../parser/lexical'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Context from '../../context/context'
import Hash from '../../template/tag/hash'
import ITemplate from '../../template/itemplate'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'
import { ForloopDrop } from '../../drop/forloop-drop'

const re = new RegExp(`^(${identifier.source})\\s+in\\s+` +
  `(${value.source})` +
  `(?:\\s+${hash.source})*` +
  `(?:\\s+(reversed))?` +
  `(?:\\s+${hash.source})*$`)

export default <ITagImplOptions>{
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
  render: async function (ctx: Context, hash: Hash) {
    let collection = await evalExp(this.collection, ctx)

    if (!isArray(collection)) {
      if (isString(collection) && collection.length > 0) {
        collection = [collection] as string[]
      } else if (isObject(collection)) {
        collection = Object.keys(collection).map((key) => [key, collection[key]])
      }
    }
    if (!isArray(collection) || !collection.length) {
      return this.liquid.renderer.renderTemplates(this.elseTemplates, ctx)
    }

    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    if (this.reversed) collection.reverse()

    const context = { forloop: new ForloopDrop(collection.length) }
    ctx.push(context)
    let html = ''
    for (const item of collection) {
      context[this.variable] = item
      try {
        html += await this.liquid.renderer.renderTemplates(this.templates, ctx)
      } catch (e) {
        if (e.name === 'RenderBreakError') {
          html += e.resolvedHTML
          if (e.message === 'break') break
        } else throw e
      }
      context.forloop.next()
    }
    ctx.pop()
    return html
  }
}
