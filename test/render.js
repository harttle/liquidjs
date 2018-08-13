'use strict'
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

chai.use(sinonChai)
chai.use(chaiAsPromised)

let tag = require('../src/tag.js')()
let Scope = require('../src/scope.js')
let filter = require('../src/filter')()
let Render = require('../src/render.js')
let Template = require('../src/parser.js')(tag, filter)
let render

describe('render', function () {
  beforeEach(function () {
    filter.clear()
    tag.clear()
    render = Render()
  })

  describe('.renderTemplates()', function () {
    it('should throw when scope undefined', function () {
      expect(function () {
        render.renderTemplates([])
      }).to.throw(/scope undefined/)
    })

    it('should render html', function () {
      let scope = Scope.factory({})
      return expect(render.renderTemplates([{type: 'html', value: '<p>'}], scope)).to.eventually.equal('<p>')
    })
  })

  describe('.renderValue()', function () {
    it('should respect to .to_liquid() method', function () {
      let scope = Scope.factory({
        bar: { to_liquid: x => 'custom' }
      })
      let tpl = Template.parseValue('bar')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('custom')
    })
    it('should stringify objects', function () {
      let scope = Scope.factory({
        foo: { obj: { arr: ['a', 2] } }
      })
      let tpl = Template.parseValue('foo')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"obj":{"arr":["a",2]}}')
    })
    it('should skip circular property', function () {
      let ctx = { foo: { num: 2 }, bar: 'bar' }
      ctx.foo.circular = ctx

      let scope = Scope.factory(ctx)
      let tpl = Template.parseValue('foo')
      return expect(render.renderValue(tpl, scope)).to.eventually.equal('{"num":2,"circular":{"bar":"bar"}}')
    })
    it('should skip function property', function () {
      let scope = Scope.factory({obj: {foo: 'foo', bar: x => x}})
      let tpl = Template.parseValue('obj')
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
      let tpl = Template.parseValue('foo.bar[0] | date: "b" | time:2')
      let scope = Scope.factory({
        foo: { bar: ['a'] }
      })
      expect(render.evalValue(tpl, scope)).to.equal('ab6')
    })
    it('should reserve type', function () {
      filter.register('arr', () => [1])
      let tpl = Template.parseValue('"x" | arr')
      expect(render.evalValue(tpl, Scope.factory())).to.deep.equal([1])
    })
    it('should eval filter with correct arguments', function () {
      let date = sinon.stub().returns('y')
      let time = sinon.spy()
      filter.register('date', date)
      filter.register('time', time)
      let tpl = Template.parseValue('foo.bar | date: "b" | time:2')
      let scope = Scope.factory({
        foo: {bar: 'bar'}
      })
      render.evalValue(tpl, scope)
      expect(date).to.have.been.calledWith('bar', 'b')
      expect(time).to.have.been.calledWith('y', 2)
    })
  })
})
