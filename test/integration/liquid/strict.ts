import { Liquid } from '../../../src/liquid'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

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
    engine = new Liquid({
      root: '/root/',
      extname: '.html',
      strictVariables: true
    })
    return expect(engine.render(tpl, ctx)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
  it('should pass strictVariables to render by parseAndRender', function () {
    const html = 'before{{notdefined}}after'
    engine = new Liquid({
      root: '/root/',
      extname: '.html',
      strictVariables: true
    })
    return expect(engine.parseAndRender(html, ctx)).to
      .be.rejectedWith(/undefined variable: notdefined/)
  })
  describe('with strictVariables and lenientIf', function () {
    beforeEach(() => {
      engine = new Liquid({
        root: '/root/',
        extname: '.html',
        strictVariables: true,
        lenientIf: true
      })
    })
    it('should not throw in `if` with a single variable', async function () {
      const tpl = engine.parse('before{% if notdefined %}{{notdefined}}{% endif %}after')
      const html = await engine.render(tpl, ctx)
      return expect(html).to.equal('beforeafter')
    })
    it('should support elsif with undefined variables', async function () {
      const tpl = engine.parse('{% if notdefined1 %}a{% elsif notdefined2 %}b{% elsif defined3 %}{{defined3}}{% else %}d{% endif %}')
      const html = await engine.render(tpl, { 'defined3': 'bla' })
      return expect(html).to.equal('bla')
    })
    it('should not throw in `unless` with a single variable', async function () {
      const tpl = engine.parse('before{% unless notdefined %}X{% else %}{{notdefined}}{% endunless %}after')
      const html = await engine.render(tpl, ctx)
      return expect(html).to.equal('beforeXafter')
    })
    it('should still throw with an undefined variable in a compound `if` expression', function () {
      const tpl = engine.parse('{% if notdefined == 15 %}a{% endif %}')
      const fhtml = engine.render(tpl, ctx)
      return expect(fhtml).to.be.rejectedWith(/undefined variable: notdefined/)
    })
    it('should allow an undefined variable when before the `default` filter', async function () {
      const tpl = engine.parse('{{notdefined | default: "a" | tolower}}')
      const html = await engine.render(tpl, ctx)
      return expect(html).to.equal('a')
    })
    it('should not allow undefined variable even if `lenientIf` set', async function () {
      const tpl = engine.parse('{{notdefined | tolower}}')
      return expect(() => engine.renderSync(tpl, ctx)).to.throw('undefined variable: notdefined')
    })
  })
})
