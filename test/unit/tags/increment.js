import Liquid from '../../../src'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/increment', function () {
  const liquid = new Liquid()

  it('should increment undefined variable', function () {
    const src = '{% increment one %}{% increment one %}{% increment one %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012')
  })

  it('should increment defined variable', function () {
    const src = '{% increment one %}{% increment one %}{% increment one %}'
    const ctx = { one: 7 }
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('789')
        expect(ctx.one).to.equal(10)
      })
  })

  it('should be independent from assign', function () {
    const src = '{% assign var=10 %}{% increment var %}{% increment var %}{% increment var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012')
  })

  it('should be independent from capture', function () {
    const src = '{% capture var %}10{% endcapture %}{% increment var %}{% increment var %}{% increment var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012')
  })

  it('should not shading assign', function () {
    const src = '{% assign var=10 %}{% increment var %}{% increment var %}{% increment var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012 10')
  })

  it('should not shading capture', function () {
    const src = '{% capture var %}10{% endcapture %}{% increment var %}{% increment var %}{% increment var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012 10')
  })
})
