import { mapSeries } from '../../util/promise'
import { isString, isObject, isArray } from '../../util/underscore'
import { evalExp } from '../../render/syntax'
import assert from '../../util/assert'
import { identifier, value, hash } from '../../parser/lexical'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Scope from '../../scope/scope'
import Hash from '../../template/tag/hash'
import ITemplate from '../../template/itemplate'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'

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
  render: async function (scope: Scope, hash: Hash) {
    let collection = evalExp(this.collection, scope)

    if (!isArray(collection)) {
      if (isString(collection) && collection.length > 0) {
        collection = [collection] as string[]
      } else if (isObject(collection)) {
        collection = Object.keys(collection).map((key) => [key, collection[key]]) as Array<[string, any]>
      }
    }
    if (!isArray(collection) || !collection.length) {
      return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
    }

    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    if (this.reversed) collection.reverse()

    const contexts = collection.map((item: string, i: number) => {
      const ctx = {}
      ctx[this.variable] = item
      ctx['forloop'] = {
        first: i === 0,
        index: i + 1,
        index0: i,
        last: i === collection.length - 1,
        length: collection.length,
        rindex: collection.length - i,
        rindex0: collection.length - i - 1
      }
      return ctx
    })

    let html = ''
    let finished = false
    await mapSeries(contexts, async context => {
      if (finished) return

      scope.push(context)
      try {
        html += await this.liquid.renderer.renderTemplates(this.templates, scope)
      } catch (e) {
        if (e.name === 'RenderBreakError') {
          html += e.resolvedHTML
          if (e.message === 'break') {
            finished = true
          }
        } else throw e
      }
      scope.pop(context)
    })
    return html
  }
}
