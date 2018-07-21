'use strict'
const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/increment', function () {
  let liquid = Liquid()

  it('should increment undefined variable', function () {
    let src = '{% increment one %}{% increment one %}{% increment one %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012')
  })

  it('should increment defined variable', function () {
    let src = '{% increment one %}{% increment one %}{% increment one %}'
    let ctx = {one: 7}
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('789')
        expect(ctx.one).to.equal(10)
      })
  })

  it('should be independent from assign', function () {
    let src = '{% assign var=10 %}{% increment var %}{% increment var %}{% increment var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012')
  })

  it('should be independent from capture', function () {
    let src = '{% capture var %}10{% endcapture %}{% increment var %}{% increment var %}{% increment var %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012')
  })

  it('should not shading assign', function () {
    let src = '{% assign var=10 %}{% increment var %}{% increment var %}{% increment var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012 10')
  })

  it('should not shading capture', function () {
    let src = '{% capture var %}10{% endcapture %}{% increment var %}{% increment var %}{% increment var %} {{var}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('012 10')
  })
})
