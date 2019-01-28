import assert from '../util/assert.js'
import { value, quotedLine } from '../lexical.js'

const staticFileRE = /[^\s,]+/

export default function (liquid, Liquid) {
  const withRE = new RegExp(`with\\s+(${value.source})`)

  liquid.registerTag('include', {
    parse: function (token) {
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
    render: async function (scope, hash) {
      let filepath
      if (scope.opts.dynamicPartials) {
        if (quotedLine.exec(this.value)) {
          const template = this.value.slice(1, -1)
          filepath = await liquid.parseAndRender(template, scope.getAll(), scope.opts)
        } else {
          filepath = Liquid.evalValue(this.value, scope)
        }
      } else {
        filepath = this.staticValue
      }
      assert(filepath, `cannot include with empty filename`)

      const originBlocks = scope.opts.blocks
      const originBlockMode = scope.opts.blockMode

      scope.opts.blocks = {}
      scope.opts.blockMode = 'output'
      if (this.with) {
        hash[filepath] = Liquid.evalValue(this.with, scope)
      }
      const templates = await liquid.getTemplate(filepath, scope.opts.root)
      scope.push(hash)
      const html = await liquid.renderer.renderTemplates(templates, scope)
      scope.pop(hash)
      scope.opts.blocks = originBlocks
      scope.opts.blockMode = originBlockMode
      return html
    }
  })
}
