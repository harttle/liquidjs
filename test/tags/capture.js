'use strict'
const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/capture', function () {
  let liquid = Liquid()

  it('should support capture', function () {
    let src = '{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('A')
  })

  it('should shading rather than overwriting', function () {
    let src = '{% capture var %}10{% endcapture %}{{var}}'
    let ctx = {'var': 20}
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('10')
        expect(ctx.var).to.equal(20)
      })
  })

  it('should throw on invalid identifier', function () {
    let src = '{% capture = %}{%endcapture%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/= not valid identifier/)
  })

  it('should throw when capture not closed', function () {
    let src = '{%capture c%}{{c}}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag .* not closed/)
  })
})
