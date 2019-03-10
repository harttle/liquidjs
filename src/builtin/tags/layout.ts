import assert from '../../util/assert'
import { value as rValue } from '../../parser/lexical'
import { evalValue } from '../../render/syntax'
import BlockMode from '../../scope/block-mode'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Scope from '../../scope/scope'
import Hash from '../../template/tag/hash'
import ITagImplOptions from '../../template/tag/itag-impl-options'

const staticFileRE = /\S+/

export default {
  parse: function (token: TagToken, remainTokens: Token[]) {
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
  render: async function (scope: Scope, hash: Hash) {
    const layout = scope.opts.dynamicPartials
      ? await evalValue(this.layout, scope)
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
} as ITagImplOptions
