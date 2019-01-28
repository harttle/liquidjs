import { mapSeries } from '../util/promise.js'
import assert from '../util/assert.js'
import { identifier, value, hash } from '../lexical.js'

export default function (liquid, Liquid) {
  const re = new RegExp(`^(${identifier.source})\\s+in\\s+` +
    `(${value.source})` +
    `(?:\\s+${hash.source})*$`)

  liquid.registerTag('tablerow', {

    parse: function (tagToken, remainTokens) {
      const match = re.exec(tagToken.args)
      assert(match, `illegal tag: ${tagToken.raw}`)

      this.variable = match[1]
      this.collection = match[2]
      this.templates = []

      let p
      const stream = liquid.parser.parseStream(remainTokens)
        .on('start', () => (p = this.templates))
        .on('tag:endtablerow', token => stream.stop())
        .on('template', tpl => p.push(tpl))
        .on('end', () => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })

      stream.start()
    },

    render: async function (scope, hash) {
      let collection = Liquid.evalExp(this.collection, scope) || []
      const offset = hash.offset || 0
      const limit = (hash.limit === undefined) ? collection.length : hash.limit

      collection = collection.slice(offset, offset + limit)
      const cols = hash.cols || collection.length
      const contexts = collection.map((item, i) => {
        const ctx = {}
        ctx[this.variable] = item
        return ctx
      })

      let row
      let html = ''
      await mapSeries(contexts, async (context, idx) => {
        row = Math.floor(idx / cols) + 1
        const col = (idx % cols) + 1
        if (col === 1) {
          if (row !== 1) {
            html += '</tr>'
          }
          html += `<tr class="row${row}">`
        }

        html += `<td class="col${col}">`
        scope.push(context)
        html += await liquid.renderer.renderTemplates(this.templates, scope)
        html += '</td>'
        scope.pop(context)
        return html
      })
      if (row > 0) {
        html += '</tr>'
      }
      return html
    }
  })
}
