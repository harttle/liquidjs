import { Liquid } from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/increment', function () {
  const liquid = new Liquid()

  it('should increment undefined variable', async function () {
    const src = '{% increment one %}{% increment one %}{% increment one %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('012')
  })

  it('should increment defined variable', async function () {
    const src = '{% increment one %}{% increment one %}{% increment one %}'
    const ctx = { one: 7 }
    const html = await liquid.parseAndRender(src, ctx)
    expect(html).to.equal('789')
    expect(ctx.one).to.equal(10)
  })

  it('should be independent from assign', async function () {
    const src = '{% assign var=10 %}{% increment var %}{% increment var %}{% increment var %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('012')
  })

  it('should be independent from capture', async function () {
    const src = '{% capture var %}10{% endcapture %}{% increment var %}{% increment var %}{% increment var %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('012')
  })

  it('should not shading assign', async function () {
    const src = '{% assign var=10 %}{% increment var %}{% increment var %}{% increment var %} {{var}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('012 10')
  })

  it('should not hide capture', async function () {
    const src = '{% capture var %}10{% endcapture %}{% increment var %}{% increment var %}{% increment var %} {{var}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('012 10')
  })
})
