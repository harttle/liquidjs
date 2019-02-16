import Liquid from '../../../src/liquid'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('LiquidOptions#strict_*', function () {
  let engine
  const ctx = {}
  beforeEach(function () {
    engine = new Liquid({
      root: '/root/',
      extname: '.html'
    })
  })
  it('should not throw when strict_variables false (default)', function () {
    return expect(engine.parseAndRender('before{{notdefined}}after', ctx)).to
      .eventually.equal('beforeafter')
  })
  it('should throw when strict_variables true', function () {
    const tpl = engine.parse('before{{notdefined}}after')
    const opts = {
      strict_variables: true
    }
    return expect(engine.render(tpl, ctx, opts)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
  it('should pass strict_variables to render by parseAndRender', function () {
    const html = 'before{{notdefined}}after'
    const opts = {
      strict_variables: true
    }
    return expect(engine.parseAndRender(html, ctx, opts)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
})
