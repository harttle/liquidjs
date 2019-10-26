import { expect } from 'chai'
import { Context } from '../../../src/context/context'
import { Token } from '../../../src/parser/token'
import { Tag } from '../../../src/template/tag/tag'
import { Filter } from '../../../src/template/filter/filter'
import { Render } from '../../../src/render/render'
import { HTML } from '../../../src/template/html'
import { toThenable } from '../../../src/util/async'

describe('render', function () {
  let render: Render
  before(function () {
    Filter.clear()
    Tag.clear()
    render = new Render()
  })

  describe('.renderTemplates()', function () {
    it('should render html', async function () {
      const scope = new Context()
      const token = { type: 'html', value: '<p>' } as Token
      const html = await toThenable(render.renderTemplates([new HTML(token)], scope))
      return expect(html).to.equal('<p>')
    })
  })
})
