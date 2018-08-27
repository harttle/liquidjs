export default function (liquid, Liquid) {
  liquid.registerTag('unless', {
    parse: function (tagToken, remainTokens) {
      this.templates = []
      this.elseTemplates = []
      let p
      const stream = liquid.parser.parseStream(remainTokens)
        .on('start', x => {
          p = this.templates
          this.cond = tagToken.args
        })
        .on('tag:else', () => (p = this.elseTemplates))
        .on('tag:endunless', token => stream.stop())
        .on('template', tpl => p.push(tpl))
        .on('end', x => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })

      stream.start()
    },

    render: function (scope, hash) {
      const cond = Liquid.evalExp(this.cond, scope)
      return Liquid.isFalsy(cond)
        ? liquid.renderer.renderTemplates(this.templates, scope)
        : liquid.renderer.renderTemplates(this.elseTemplates, scope)
    }
  })
}
