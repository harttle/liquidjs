import Liquid from 'src/liquid'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/decrement', function () {
  const liquid = new Liquid()
  it('should throw when variable expression illegal', function () {
    const src = '{% decrement / %}{{var}}'
    const ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })

  it('should decrement undefined variable', function () {
    const src = '{% decrement var %}{% decrement var %}{% decrement var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3')
  })

  it('should decrement defined variable', function () {
    const src = '{% decrement var %}{% decrement var %}{% decrement var %}'
    const ctx = { 'var': 10 }
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('987')
        expect(ctx.var).to.equal(7)
      })
  })

  it('should be independent from assign', function () {
    const src = '{% assign var=10 %}{% decrement var %}{% decrement var %}{% decrement var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3')
  })

  it('should be independent from capture', function () {
    const src = '{% capture var %}10{% endcapture %}{% decrement var %}{% decrement var %}{% decrement var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3')
  })

  it('should not shading assign', function () {
    const src = '{% assign var=10 %}{% decrement var %}{% decrement var %}{% decrement var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3 10')
  })

  it('should not shading capture', function () {
    const src = '{% capture var %}10{% endcapture %}{% decrement var %}{% decrement var %}{% decrement var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('-1-2-3 10')
  })

  it('should share the same variable with increment', function () {
    const src = '{%increment var%}{%increment var%}{%decrement var%}{%decrement var%}{%increment var%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('01100')
  })
})
