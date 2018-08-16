'use strict'
const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/decrement', function () {
  let liquid = Liquid()
  it('should throw when variable expression illegal', function () {
    let src = '{% decrement / %}{{var}}'
    let ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })

  it('should decrement undefined variable', function () {
    let src = '{% decrement var %}{% decrement var %}{% decrement var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3')
  })

  it('should decrement defined variable', function () {
    let src = '{% decrement var %}{% decrement var %}{% decrement var %}'
    let ctx = {'var': 10}
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('987')
        expect(ctx.var).to.equal(7)
      })
  })

  it('should be independent from assign', function () {
    let src = '{% assign var=10 %}{% decrement var %}{% decrement var %}{% decrement var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3')
  })

  it('should be independent from capture', function () {
    let src = '{% capture var %}10{% endcapture %}{% decrement var %}{% decrement var %}{% decrement var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3')
  })

  it('should not shading assign', function () {
    let src = '{% assign var=10 %}{% decrement var %}{% decrement var %}{% decrement var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3 10')
  })

  it('should not shading capture', function () {
    let src = '{% capture var %}10{% endcapture %}{% decrement var %}{% decrement var %}{% decrement var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3 10')
  })

  it('should share the same variable with increment', function () {
    let src = '{%increment var%}{%increment var%}{%decrement var%}{%decrement var%}{%increment var%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('01100')
  })
})
