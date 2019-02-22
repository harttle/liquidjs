import assert from 'src/util/assert'
import { value, quotedLine } from 'src/parser/lexical'
import { evalValue } from 'src/render/syntax'
import BlockMode from 'src/scope/block-mode'
import TagToken from 'src/parser/tag-token';
import Scope from 'src/scope/scope';
import Hash from 'src/template/tag/hash';
import ITagImplOptions from 'src/template/tag/itag-impl-options';

const staticFileRE = /[^\s,]+/
const withRE = new RegExp(`with\\s+(${value.source})`)

export default <ITagImplOptions>{
  parse: function (token: TagToken) {
    let match = staticFileRE.exec(token.args)
    if (match) {
      this.staticValue = match[0]
    }

    match = value.exec(token.args)
    if (match) {
      this.value = match[0]
    }

    match = withRE.exec(token.args)
    if (match) {
      this.with = match[1]
    }
  },
  render: async function (scope: Scope, hash: Hash) {
    let filepath
    if (scope.opts.dynamicPartials) {
      if (quotedLine.exec(this.value)) {
        const template = this.value.slice(1, -1)
        filepath = await this.liquid.parseAndRender(template, scope.getAll(), scope.opts)
      } else {
        filepath = evalValue(this.value, scope)
      }
    } else {
      filepath = this.staticValue
    }
    assert(filepath, `cannot include with empty filename`)

    const originBlocks = scope.blocks
    const originBlockMode = scope.blockMode

    scope.blocks = {}
    scope.blockMode = BlockMode.OUTPUT
    if (this.with) {
      hash[filepath] = evalValue(this.with, scope)
    }
    const templates = await this.liquid.getTemplate(filepath, scope.opts)
    scope.push(hash)
    const html = await this.liquid.renderer.renderTemplates(templates, scope)
    scope.pop(hash)
    scope.blocks = originBlocks
    scope.blockMode = originBlockMode
    return html
  }
}
