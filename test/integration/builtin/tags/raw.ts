import Liquid from '../../../../src/liquid'
import { expect } from 'chai'

describe('tags/raw', function () {
  const liquid = new Liquid()
  it('should support raw 1', async function () {
    const p = liquid.parseAndRender('{% raw%}')
    return expect(p).be.rejectedWith(/{% raw%} not closed/)
  })
  it('should support raw 2', async function () {
    const src = '{% raw %}{{ 5 | plus: 6 }}{% endraw %} is equal to 11.'
    const dst = '{{ 5 | plus: 6 }} is equal to 11.'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })
  it('should support raw 3', async function () {
    const src = '{% raw %}\n{{ foo}} \n{% endraw %}'
    const dst = '\n{{ foo}} \n'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })
})
