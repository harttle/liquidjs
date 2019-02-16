import { evalExp, isFalsy } from 'src/render/syntax'

export default {
  parse: function (tagToken, remainTokens) {
    this.templates = []
    this.elseTemplates = []
    let p
    const stream = this.liquid.parser.parseStream(remainTokens)
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
    const cond = evalExp(this.cond, scope)
    return isFalsy(cond)
      ? this.liquid.renderer.renderTemplates(this.templates, scope)
      : this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }
}
