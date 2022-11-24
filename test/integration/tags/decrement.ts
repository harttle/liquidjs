import { Liquid } from '../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/decrement', function () {
  const liquid = new Liquid()

  it('should decrement undefined variable', async function () {
    const src = '{% decrement var %}{% decrement var %}{% decrement var %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-1-2-3')
  })

  it('should decrement defined variable', async function () {
    const src = '{% decrement var %}{% decrement var %}{% decrement var %}'
    const ctx = { 'var': 10 }
    const html = await liquid.parseAndRender(src, ctx)
    expect(html).to.equal('987')
    expect(ctx.var).to.equal(7)
  })

  it('should be independent from assign', async function () {
    const src = '{% assign var=10 %}{% decrement var %}{% decrement var %}{% decrement var %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-1-2-3')
  })

  it('should be independent from capture', async function () {
    const src = '{% capture var %}10{% endcapture %}{% decrement var %}{% decrement var %}{% decrement var %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-1-2-3')
  })

  it('should not shading assign', async function () {
    const src = '{% assign var=10 %}{% decrement var %}{% decrement var %}{% decrement var %} {{var}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-1-2-3 10')
  })

  it('should not shading capture', async function () {
    const src = '{% capture var %}10{% endcapture %}{% decrement var %}{% decrement var %}{% decrement var %} {{var}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-1-2-3 10')
  })

  it('should share the same variable with increment', async function () {
    const src = '{%increment var%}{%increment var%}{%decrement var%}{%decrement var%}{%increment var%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('01100')
  })
})
