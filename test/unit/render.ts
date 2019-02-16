import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import Scope from '../../src/scope/scope'
import Token from 'src/parser/token'
import Tag from 'src/template/tag/tag'
import Filter from 'src/template/filter'
import Render from '../../src/render/render'
import Parser from '../../src/parser/parser'
import HTML from 'src/template/html'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const expect = chai.expect
const parser = new Parser(null)
let render

describe('render', function () {
  beforeEach(function () {
    Filter.clear()
    Tag.clear()
    render = new Render()
  })

  describe('.renderTemplates()', function () {
    it('should throw when scope undefined', function () {
      expect(render.renderTemplates([])).to.be.rejectedWith(/scope undefined/)
    })

    it('should render html', function () {
      const scope = new Scope()
      const token = { type: 'html', value: '<p>' } as Token
      return expect(render.renderTemplates([new HTML(token)], scope)).to.eventually.equal('<p>')
    })
  })
})
