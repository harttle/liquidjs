import { evalExp } from 'src/render/syntax'

export default {
  parse: function (tagToken, remainTokens) {
    this.cond = tagToken.args
    this.cases = []
    this.elseTemplates = []

    let p = []
    const stream = this.liquid.parser.parseStream(remainTokens)
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
    for (let i = 0; i < this.cases.length; i++) {
      const branch = this.cases[i]
      const val = evalExp(branch.val, scope)
      const cond = evalExp(this.cond, scope)
      if (val === cond) {
        return this.liquid.renderer.renderTemplates(branch.templates, scope)
      }
    }
    return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
}
