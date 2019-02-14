import Liquid from '../../../src/index'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/capture', function () {
  const liquid = Liquid()

  it('should support capture', function () {
    const src = '{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('A')
  })

  it('should shading rather than overwriting', function () {
    const src = '{% capture var %}10{% endcapture %}{{var}}'
    const ctx = { 'var': 20 }
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('10')
        expect(ctx.var).to.equal(20)
      })
  })

  it('should throw on invalid identifier', function () {
    const src = '{% capture = %}{%endcapture%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/= not valid identifier/)
  })

  it('should throw when capture not closed', function () {
    const src = '{%capture c%}{{c}}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag .* not closed/)
  })
})
