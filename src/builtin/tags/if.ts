import { evalExp, isTruthy } from 'src/render/syntax'

export default {
  parse: function (tagToken, remainTokens) {
    this.branches = []
    this.elseTemplates = []

    let p
    const stream = this.liquid.parser.parseStream(remainTokens)
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
      const cond = evalExp(branch.cond, scope)
      if (isTruthy(cond)) {
        return this.liquid.renderer.renderTemplates(branch.templates, scope)
      }
    }
    return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
}
