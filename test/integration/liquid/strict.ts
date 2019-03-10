import Liquid from '../../../src/liquid'
import { expect } from 'chai'

describe('LiquidOptions#strict*', function () {
  let engine: Liquid
  const ctx = {}
  beforeEach(function () {
    engine = new Liquid({
      root: '/root/',
      extname: '.html'
    })
  })
  it('should not throw when strictVariables false (default)', async function () {
    const html = await engine.parseAndRender('before{{notdefined}}after', ctx)
    return expect(html).to.equal('beforeafter')
  })
  it('should throw when strictVariables true', function () {
    const tpl = engine.parse('before{{notdefined}}after')
    const opts = {
      strictVariables: true
    }
    return expect(engine.render(tpl, ctx, opts)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
  it('should pass strictVariables to render by parseAndRender', function () {
    const html = 'before{{notdefined}}after'
    const opts = {
      strictVariables: true
    }
    return expect(engine.parseAndRender(html, ctx, opts)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
})
