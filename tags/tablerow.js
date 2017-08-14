const Liquid = require('..')
const Promise = require('any-promise')
const lexical = Liquid.lexical
const assert = require('../src/util/assert.js')
const re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
  `(${lexical.value.source})` +
  `(?:\\s+${lexical.hash.source})*$`)

module.exports = function (liquid) {
  liquid.registerTag('tablerow', {

    parse: function (tagToken, remainTokens) {
      var match = re.exec(tagToken.args)
      assert(match, `illegal tag: ${tagToken.raw}`)

      this.variable = match[1]
      this.collection = match[2]
      this.templates = []

      var p
      var stream = liquid.parser.parseStream(remainTokens)
        .on('start', () => (p = this.templates))
        .on('tag:endtablerow', token => stream.stop())
        .on('template', tpl => p.push(tpl))
        .on('end', () => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })

      stream.start()
    },

    render: function (scope, hash) {
      var collection = Liquid.evalExp(this.collection, scope) || []

      var html = '<table>'
      var offset = hash.offset || 0
      var limit = (hash.limit === undefined) ? collection.length : hash.limit

      var cols = hash.cols
      var row
      var col
      if (!cols) throw new Error(`illegal cols: ${cols}`)

      // build array of arguments to pass to sequential promises...
      collection = collection.slice(offset, offset + limit)
      var contexts = []
      collection.some((item, i) => {
        var ctx = {}
        ctx[this.variable] = item
        contexts.push(ctx)
      })

      var lastPromise = contexts.reduce((promise, context, currentIndex) => promise
        .then((partial) => {
          row = Math.floor(currentIndex / cols) + 1
          col = (currentIndex % cols) + 1
          if (col === 1) {
            if (row !== 1) {
              html += '</tr>'
            }
            html += `<tr class="row${row}">`
          }

          // ctx[this.variable] = context;
          html += `<td class="col${col}">`
          return html
        })
        .then((partial) => {
          scope.push(context)
          return liquid.renderer.renderTemplates(this.templates, scope)
        })
        .then((partial) => {
          scope.pop(context)
          html += partial
          html += '</td>'
          return html
        }), Promise.resolve(''))

      return lastPromise
        .then(() => {
          if (row > 0) {
            html += '</tr>'
          }
          html += '</table>'
          return html
        })
    }
  })
}
