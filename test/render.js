import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import Tag from '../src/tag.js'
import {factory as scopeFactory} from '../src/scope.js'
import Filter from '../src/filter'
import Render from '../src/render.js'
import parser from '../src/parser.js'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const expect = chai.expect
const tag = Tag()
const filter = Filter()
const Template = parser(tag, filter)
let render

describe('render', function () {
  beforeEach(function () {
    filter.clear()
    tag.clear()
    render = Render()
  })

  describe('.renderTemplates()', function () {
    it('should throw when scope undefined', function () {
      expect(render.renderTemplates([])).to.be.rejectedWith(/scope undefined/)
    })

    it('should render html', function () {
      const scope = scopeFactory({})
      return expect(render.renderTemplates([{type: 'html', value: '<p>'}], scope)).to.eventually.equal('<p>')
    })
  })

  describe('.renderValue()', function () {
    it('should respect to .to_liquid() method', function () {
      const scope = scopeFactory({
        bar: { to_liquid: x => 'custom' }
      })
      const tpl = Template.parseValue('bar')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('custom')
    })
    it('should stringify objects', function () {
      const scope = scopeFactory({
        foo: { obj: { arr: ['a', 2] } }
      })
      const tpl = Template.parseValue('foo')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"obj":{"arr":["a",2]}}')
    })
    it('should skip circular property', function () {
      const ctx = { foo: { num: 2 }, bar: 'bar' }
      ctx.foo.circular = ctx

      const scope = scopeFactory(ctx)
      const tpl = Template.parseValue('foo')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"num":2,"circular":{"bar":"bar"}}')
    })
    it('should skip function property', function () {
      const scope = scopeFactory({obj: {foo: 'foo', bar: x => x}})
      const tpl = Template.parseValue('obj')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"foo":"foo"}')
    })
  })

  describe('.evalValue()', function () {
    it('should throw when scope undefined', function () {
      expect(function () {
        render.evalValue()
      }).to.throw(/scope undefined/)
    })
    it('should eval value', function () {
      filter.register('date', (l, r) => l + r)
      filter.register('time', (l, r) => l + 3 * r)
      const tpl = Template.parseValue('foo.bar[0] | date: "b" | time:2')
      const scope = scopeFactory({
        foo: { bar: ['a'] }
      })
      expect(render.evalValue(tpl, scope)).to.equal('ab6')
    })
    it('should reserve type', function () {
      filter.register('arr', () => [1])
      const tpl = Template.parseValue('"x" | arr')
      expect(render.evalValue(tpl, scopeFactory())).to.deep.equal([1])
    })
    it('should eval filter with correct arguments', function () {
      const date = sinon.stub().returns('y')
      const time = sinon.spy()
      filter.register('date', date)
      filter.register('time', time)
      const tpl = Template.parseValue('foo.bar | date: "b" | time:2')
      const scope = scopeFactory({
        foo: {bar: 'bar'}
      })
      render.evalValue(tpl, scope)
      expect(date).to.have.been.calledWith('bar', 'b')
      expect(time).to.have.been.calledWith('y', 2)
    })
  })
})
