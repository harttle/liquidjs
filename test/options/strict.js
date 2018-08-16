const chai = require('chai')
const expect = chai.expect
const Liquid = require('../../src')
chai.use(require('chai-as-promised'))

describe('strict options', function () {
  let engine
  let ctx = {}
  beforeEach(function () {
    engine = Liquid({
      root: '/root/',
      extname: '.html'
    })
  })
  it('should not throw when strict_variables false (default)', function () {
    return expect(engine.parseAndRender('before{{notdefined}}after', ctx)).to
      .eventually.equal('beforeafter')
  })
  it('should throw when strict_variables true', function () {
    let tpl = engine.parse('before{{notdefined}}after')
    let opts = {
      strict_variables: true
    }
    return expect(engine.render(tpl, ctx, opts)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
  it('should pass strict_variables to render by parseAndRender', function () {
    let html = 'before{{notdefined}}after'
    let opts = {
      strict_variables: true
    }
    return expect(engine.parseAndRender(html, ctx, opts)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
})
