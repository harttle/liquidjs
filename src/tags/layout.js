import assert from '../util/assert.js'
import { value as rValue } from '../lexical.js'

/*
 * blockMode:
 * * "store": store rendered html into blocks
 * * "output": output rendered html
 */

export default function (liquid, Liquid) {
  const staticFileRE = /\S+/

  liquid.registerTag('layout', {
    parse: function (token, remainTokens) {
      let match = staticFileRE.exec(token.args)
      if (match) {
        this.staticLayout = match[0]
      }

      match = rValue.exec(token.args)
      if (match) {
        this.layout = match[0]
      }

      this.tpls = liquid.parser.parse(remainTokens)
    },
    render: async function (scope, hash) {
      const layout = scope.opts.dynamicPartials
        ? Liquid.evalValue(this.layout, scope)
        : this.staticLayout
      assert(layout, `cannot apply layout with empty filename`)

      // render the remaining tokens immediately
      scope.opts.blockMode = 'store'
      const html = await liquid.renderer.renderTemplates(this.tpls, scope)
      if (scope.opts.blocks[''] === undefined) {
        scope.opts.blocks[''] = html
      }
      const templates = await liquid.getTemplate(layout, scope.opts.root)
      scope.push(hash)
      scope.opts.blockMode = 'output'
      const partial = await liquid.renderer.renderTemplates(templates, scope)
      scope.pop(hash)
      return partial
    }
  })

  liquid.registerTag('block', {
    parse: function (token, remainTokens) {
      const match = /\w+/.exec(token.args)
      this.block = match ? match[0] : ''

      this.tpls = []
      const stream = liquid.parser.parseStream(remainTokens)
        .on('tag:endblock', () => stream.stop())
        .on('template', tpl => this.tpls.push(tpl))
        .on('end', () => {
          throw new Error(`tag ${token.raw} not closed`)
        })
      stream.start()
    },
    render: async function (scope) {
      const childDefined = scope.opts.blocks[this.block]
      const html = childDefined !== undefined
        ? childDefined
        : await liquid.renderer.renderTemplates(this.tpls, scope)

      if (scope.opts.blockMode === 'store') {
        scope.opts.blocks[this.block] = html
        return ''
      }
      return html
    }
  })
}
