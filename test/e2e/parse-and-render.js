var chai = require('chai')
var Liquid = require('../..')
var expect = chai.expect

chai.use(require('chai-as-promised'))

describe('.parseAndRender()', function () {
  var engine, strictEngine
  beforeEach(function () {
    engine = Liquid()
    strictEngine = Liquid({
      strict_filters: true
    })
  })
  it('should value object', function () {
    var ctx = { obj: { foo: 'bar' } }
    return expect(engine.parseAndRender('{{obj}}', ctx)).to.eventually.equal('{"foo":"bar"}')
  })
  it('should value array', function () {
    var ctx = { arr: [-2, 'a'] }
    return expect(engine.parseAndRender('{{arr}}', ctx)).to.eventually.equal('[-2,"a"]')
  })
  it('should value undefined to empty', function () {
    return expect(engine.parseAndRender('foo{{zzz}}bar', {})).to.eventually.equal('foobar')
  })
  it('should render as null when filter undefined', function () {
    return expect(engine.parseAndRender('{{"foo" | filter1}}', {})).to.eventually.equal('foo')
  })
  it('should throw upon undefined filter when strict_filters set', function () {
    return expect(strictEngine.parseAndRender('{{"foo" | filter1}}', {})).to
      .be.rejectedWith(/undefined filter: filter1/)
  })
  it('should parse html', function () {
    expect(function () {
      engine.parse('{{obj}}')
    }).to.not.throw()
    expect(function () {
      engine.parse('<html><head>{{obj}}</head></html>')
    }).to.not.throw()
  })
  it('should render template multiple times', function () {
    var ctx = { obj: { foo: 'bar' } }
    var template = engine.parse('{{obj}}')
    return engine.render(template, ctx)
      .then(result => expect(result).to.equal('{"foo":"bar"}'))
      .then(() => engine.render(template, ctx))
      .then((result) => expect(result).to.equal('{"foo":"bar"}'))
  })
  it('should render filters', function () {
    var ctx = { names: ['alice', 'bob'] }
    var template = engine.parse('<p>{{names | join: ","}}</p>')
    return expect(engine.render(template, ctx)).to.eventually.equal('<p>alice,bob</p>')
  })
  it('should render accessive filters', function () {
    var src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
      '{{ my_array | first }}'
    return expect(engine.parseAndRender(src)).to.eventually.equal('apples')
  })
})
