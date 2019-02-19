import assert from 'src/util/assert'
import { value as rValue } from 'src/parser/lexical'
import { evalValue } from 'src/render/syntax'
import BlockMode from 'src/scope/block-mode'

const staticFileRE = /\S+/

export default {
  parse: function (token, remainTokens) {
    let match = staticFileRE.exec(token.args)
    if (match) {
      this.staticLayout = match[0]
    }

    match = rValue.exec(token.args)
    if (match) {
      this.layout = match[0]
    }

    this.tpls = this.liquid.parser.parse(remainTokens)
  },
  render: async function (scope, hash) {
    const layout = scope.opts.dynamicPartials
      ? evalValue(this.layout, scope)
      : this.staticLayout
    assert(layout, `cannot apply layout with empty filename`)

    // render the remaining tokens immediately
    scope.blockMode = BlockMode.STORE
    const html = await this.liquid.renderer.renderTemplates(this.tpls, scope)
    if (scope.blocks[''] === undefined) {
      scope.blocks[''] = html
    }
    const templates = await this.liquid.getTemplate(layout, scope.opts)
    scope.push(hash)
    scope.blockMode = BlockMode.OUTPUT
    const partial = await this.liquid.renderer.renderTemplates(templates, scope)
    scope.pop(hash)
    return partial
  }
}
