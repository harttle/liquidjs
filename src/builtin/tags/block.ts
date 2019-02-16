import BlockMode from 'src/scope/block-mode'

export default {
  parse: function (token, remainTokens) {
    const match = /\w+/.exec(token.args)
    this.block = match ? match[0] : ''

    this.tpls = []
    const stream = this.liquid.parser.parseStream(remainTokens)
      .on('tag:endblock', () => stream.stop())
      .on('template', tpl => this.tpls.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`)
      })
    stream.start()
  },
  render: async function (scope) {
    const childDefined = scope.blocks[this.block]
    const html = childDefined !== undefined
      ? childDefined
      : await this.liquid.renderer.renderTemplates(this.tpls, scope)

    if (scope.blockMode === BlockMode.STORE) {
      scope.blocks[this.block] = html
      return ''
    }
    return html
  }
}
