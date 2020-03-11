import { expect } from 'chai'
import { Liquid } from '../../../src/liquid'

describe('liquid#registerTag()', function () {
  it('should support render to simple string', async () => {
    const liquid = new Liquid()
    liquid.registerTag('simple-string', {
      render: () => 'B'
    })
    const html = await liquid.parseAndRender(`A{% simple-string %}C`)
    return expect(html).to.equal('ABC')
  })
  it('should support async tag render', async () => {
    const liquid = new Liquid()
    liquid.registerTag('async-string', {
      render: async () => 'B'
    })
    const html = await liquid.parseAndRender(`A{% async-string %}C`)
    return expect(html).to.equal('ABC')
  })
  it('should have access to ctx in render()', async () => {
    const liquid = new Liquid()
    liquid.registerTag('dynamic-string', {
      render: async (ctx) => ctx.get(['c'])
    })
    const html = await liquid.parseAndRender(`A{% dynamic-string %}C`, {
      c: 'B'
    })
    return expect(html).to.equal('ABC')
  })
  it('should have access to tag arguments', async () => {
    const liquid = new Liquid()
    liquid.registerTag('argument-reflector', {
      parse: function (token) { this.variable = token.args.split('=')[1] },
      render: async function (ctx) { return ctx.get(this.variable) }
    })
    const html = await liquid.parseAndRender(`A{% argument-reflector variable=c %}C`, {
      c: 'B'
    })
    return expect(html).to.equal('ABC')
  })
})
