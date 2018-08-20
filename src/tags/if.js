export default function (liquid, Liquid) {
  liquid.registerTag('if', {

    parse: function (tagToken, remainTokens) {
      this.branches = []
      this.elseTemplates = []

      let p
      const stream = liquid.parser.parseStream(remainTokens)
        .on('start', () => this.branches.push({
          cond: tagToken.args,
          templates: (p = [])
        }))
        .on('tag:elsif', token => {
          this.branches.push({
            cond: token.args,
            templates: p = []
          })
        })
        .on('tag:else', () => (p = this.elseTemplates))
        .on('tag:endif', token => stream.stop())
        .on('template', tpl => p.push(tpl))
        .on('end', x => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })

      stream.start()
    },

    render: function (scope, hash) {
      for (const branch of this.branches) {
        const cond = Liquid.evalExp(branch.cond, scope)
        if (Liquid.isTruthy(cond)) {
          return liquid.renderer.renderTemplates(branch.templates, scope)
        }
      }
      return liquid.renderer.renderTemplates(this.elseTemplates, scope)
    }
  })
}
