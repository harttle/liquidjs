import { expect } from 'chai'
import { Context } from '../../../src/context/context'
import { HTMLToken } from '../../../src/tokens/html-token'
import { Render } from '../../../src/render/render'
import { HTML } from '../../../src/template/html'
import { Emitter } from '../../../src/render/emitter'
import { toThenable } from '../../../src/util/async'

describe('render', function () {
  let render: Render
  before(function () {
    render = new Render()
  })

  describe('.renderTemplates()', function () {
    it('should render html', async function () {
      const scope = new Context()
      const token = { getContent: () => '<p>' } as HTMLToken
      const html = await toThenable(render.renderTemplates([new HTML(token)], scope, new Emitter(scope.opts.keepOutputType)))
      return expect(html).to.equal('<p>')
    })
  })
})
