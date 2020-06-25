import { Liquid } from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('.parseAndRender()', function () {
  var engine: Liquid, strictEngine: Liquid
  beforeEach(function () {
    engine = new Liquid()
    strictEngine = new Liquid({
      strictFilters: true
    })
  })
  it('should stringify array ', async function () {
    var ctx = { arr: [-2, 'a'] }
    const html = await engine.parseAndRender('{{arr}}', ctx)
    return expect(html).to.equal('-2,a')
  })
  it('should render undefined as empty', async function () {
    const html = await engine.parseAndRender('foo{{zzz}}bar', {})
    return expect(html).to.equal('foobar')
  })
  it('should render as null when filter undefined', async function () {
    const html = await engine.parseAndRender('{{"foo" | filter1}}', {})
    return expect(html).to.equal('foo')
  })
  it('should throw upon undefined filter when strictFilters set', function () {
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
  it('template should be able to be rendered multiple times', async function () {
    const ctx = { obj: [1, 2] }
    const template = engine.parse('{{obj}}')
    const result = await engine.render(template, ctx)
    expect(result).to.equal('1,2')
    const result2 = await engine.render(template, ctx)
    expect(result2).to.equal('1,2')
  })
  it('should support the "join" filter', async function () {
    var ctx = { names: ['alice', 'bob'] }
    var template = engine.parse('<p>{{names | join: ","}}</p>')
    const html = await engine.render(template, ctx)
    return expect(html).to.equal('<p>alice,bob</p>')
  })
  it('should support the "first" filter', async function () {
    var src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
      '{{ my_array | first }}'
    const html = await engine.parseAndRender(src)
    return expect(html).to.equal('apples')
  })
  it('should support nil(null, undefined) literal', async function () {
    const src = '{% if notexist == nil %}true{% endif %}'
    const html = await engine.parseAndRender(src)
    expect(html).to.equal('true')
  })
})
