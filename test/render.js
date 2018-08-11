const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

chai.use(sinonChai)
chai.use(chaiAsPromised)

var tag = require('../src/tag.js')()
var Scope = require('../src/scope.js')
var filter = require('../src/filter')()
var Render = require('../src/render.js')
var Template = require('../src/parser.js')(tag, filter)

describe('render', function () {
  var scope, render

  beforeEach(function () {
    var ctx = {
      foo: {
        bar: ['a', 2]
      },
      bar: {
        to_liquid: x => 'custom'
      }
    }
    ctx.self = ctx

    scope = Scope.factory(ctx)
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
      return expect(render.renderTemplates([{type: 'html', value: '<p>'}], scope)).to.eventually.equal('<p>')
    })
  })

  describe('.renderValue()', function () {
    it('should respect to .to_liquid() method', function () {
      var tpl = Template.parseValue('bar')
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

  it('should eval filter with correct arguments', function () {
    var date = sinon.stub().returns('y')
    var time = sinon.spy()
    filter.register('date', date)
    filter.register('time', time)
    var tpl = Template.parseValue('foo.bar[0] | date: "b" | time:2')
    render.evalValue(tpl, scope)
    expect(date).to.have.been.calledWith('a', 'b')
    expect(time).to.have.been.calledWith('y', 2)
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
      var tpl = Template.parseValue('foo.bar[0] | date: "b" | time:2')
      expect(render.evalValue(tpl, scope)).to.equal('ab6')
    })
    it('should reserve type', function () {
      filter.register('arr', () => [1])
      var tpl = Template.parseValue('"x" | arr')
      expect(render.evalValue(tpl, scope)).to.deep.equal([1])
    })
  })
})
