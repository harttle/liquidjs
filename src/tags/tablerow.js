import Liquid from '..'
import {mapSeries} from '../util/promise.js'
import assert from '../util/assert.js'

const lexical = Liquid.lexical
const re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
  `(${lexical.value.source})` +
  `(?:\\s+${lexical.hash.source})*$`)

module.exports = function (liquid) {
  liquid.registerTag('tablerow', {

    parse: function (tagToken, remainTokens) {
      let match = re.exec(tagToken.args)
      assert(match, `illegal tag: ${tagToken.raw}`)

      this.variable = match[1]
      this.collection = match[2]
      this.templates = []

      let p
      let stream = liquid.parser.parseStream(remainTokens)
        .on('start', () => (p = this.templates))
        .on('tag:endtablerow', token => stream.stop())
        .on('template', tpl => p.push(tpl))
        .on('end', () => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })

      stream.start()
    },

    render: function (scope, hash) {
      let collection = Liquid.evalExp(this.collection, scope) || []

      let html = ''
      let offset = hash.offset || 0
      let limit = (hash.limit === undefined) ? collection.length : hash.limit

      let cols = hash.cols
      let row
      let col

      // build array of arguments to pass to sequential promises...
      collection = collection.slice(offset, offset + limit)
      if (!cols) cols = collection.length
      let contexts = collection.map((item, i) => {
        let ctx = {}
        ctx[this.variable] = item
        return ctx
      })

      return mapSeries(contexts,
        (context, idx) => {
          row = Math.floor(idx / cols) + 1
          col = (idx % cols) + 1
          if (col === 1) {
            if (row !== 1) {
              html += '</tr>'
            }
            html += `<tr class="row${row}">`
          }

          html += `<td class="col${col}">`
          scope.push(context)
          return liquid.renderer
            .renderTemplates(this.templates, scope)
            .then((partial) => {
              scope.pop(context)
              html += partial
              html += '</td>'
              return html
            })
        })
        .then(() => {
          if (row > 0) {
            html += '</tr>'
          }
          return html
        })
    }
  })
}
