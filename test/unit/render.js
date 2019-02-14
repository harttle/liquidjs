import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import Tag from '../../src/tag'
import Scope from '../../src/scope'
import Filter from '../../src/filter'
import Render from '../../src/render'
import parser from '../../src/parser'

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
      const scope = new Scope()
      return expect(render.renderTemplates([{ type: 'html', value: '<p>' }], scope)).to.eventually.equal('<p>')
    })
  })

  describe('.renderValue()', function () {
    it('should respect to .to_liquid() method', function () {
      const scope = new Scope({
        bar: { to_liquid: x => 'custom' }
      })
      const tpl = Template.parseValue('bar')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('custom')
    })
    it('should stringify objects', function () {
      const scope = new Scope({
        foo: { obj: { arr: ['a', 2] } }
      })
      const tpl = Template.parseValue('foo')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"obj":{"arr":["a",2]}}')
    })
    it('should skip circular property', function () {
      const ctx = { foo: { num: 2 }, bar: 'bar' }
      ctx.foo.circular = ctx

      const scope = new Scope(ctx)
      const tpl = Template.parseValue('foo')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"num":2,"circular":{"bar":"bar"}}')
    })
    it('should skip function property', function () {
      const scope = new Scope({ obj: { foo: 'foo', bar: x => x } })
      const tpl = Template.parseValue('obj')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"foo":"foo"}')
    })
    it('should respect to .toString()', async () => {
      const scope = new Scope({ obj: { toString: () => 'FOO' } })
      const tpl = Template.parseValue('obj')
      const str = await render.renderValue(tpl, scope)
      return expect(str).to.equal('FOO')
    })
    it('should respect to .to_s()', async () => {
      const scope = new Scope({ obj: { to_s: () => 'FOO' } })
      const tpl = Template.parseValue('obj')
      const str = await render.renderValue(tpl, scope)
      return expect(str).to.equal('FOO')
    })
    it('should respect to .liquid_method_missing()', async () => {
      const scope = new Scope({ obj: { liquid_method_missing: x => x.toUpperCase() } })
      const tpl = Template.parseValue('obj.foo')
      const str = await render.renderValue(tpl, scope)
      return expect(str).to.equal('FOO')
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
      const scope = new Scope({
        foo: { bar: ['a'] }
      })
      expect(render.evalValue(tpl, scope)).to.equal('ab6')
    })
    it('should reserve type', function () {
      filter.register('arr', () => [1])
      const tpl = Template.parseValue('"x" | arr')
      expect(render.evalValue(tpl, new Scope())).to.deep.equal([1])
    })
    it('should eval filter with correct arguments', function () {
      const date = sinon.stub().returns('y')
      const time = sinon.spy()
      filter.register('date', date)
      filter.register('time', time)
      const tpl = Template.parseValue('foo.bar | date: "b" | time:2')
      const scope = new Scope({
        foo: { bar: 'bar' }
      })
      render.evalValue(tpl, scope)
      expect(date).to.have.been.calledWith('bar', 'b')
      expect(time).to.have.been.calledWith('y', 2)
    })
  })
})
