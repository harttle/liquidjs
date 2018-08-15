const Liquid = require('..')

module.exports = function (liquid) {
  liquid.registerTag('case', {

    parse: function (tagToken, remainTokens) {
      this.cond = tagToken.args
      this.cases = []
      this.elseTemplates = []

      var p = []
      var stream = liquid.parser.parseStream(remainTokens)
        .on('tag:when', token => {
          this.cases.push({
            val: token.args,
            templates: p = []
          })
        })
        .on('tag:else', () => (p = this.elseTemplates))
        .on('tag:endcase', token => stream.stop())
        .on('template', tpl => p.push(tpl))
        .on('end', x => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })

      stream.start()
    },

    render: function (scope, hash) {
      for (var i = 0; i < this.cases.length; i++) {
        var branch = this.cases[i]
        var val = Liquid.evalExp(branch.val, scope)
        var cond = Liquid.evalExp(this.cond, scope)
        if (val === cond) {
          return liquid.renderer.renderTemplates(branch.templates, scope)
        }
      }
      return liquid.renderer.renderTemplates(this.elseTemplates, scope)
    }
  })
}
