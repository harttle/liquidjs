import assert from '../util/assert.js'

export default function (liquid, Liquid) {
  const rIdentifier = Liquid.lexical.identifier
  const re = new RegExp(`(${rIdentifier.source})`)
  const {CaptureScope} = Liquid.Types

  liquid.registerTag('capture', {
    parse: function (tagToken, remainTokens) {
      const match = tagToken.args.match(re)
      assert(match, `${tagToken.args} not valid identifier`)

      this.variable = match[1]
      this.templates = []

      const stream = liquid.parser.parseStream(remainTokens)
      stream.on('tag:endcapture', token => stream.stop())
        .on('template', tpl => this.templates.push(tpl))
        .on('end', x => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })
      stream.start()
    },
    render: async function (scope, hash) {
      const html = await liquid.renderer.renderTemplates(this.templates, scope)
      const ctx = Object.create(CaptureScope)
      ctx[this.variable] = html
      scope.push(ctx)
    }
  })
}
