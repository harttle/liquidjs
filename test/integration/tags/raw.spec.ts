import { Liquid } from '../../../src/liquid'

describe('tags/raw', function () {
  const liquid = new Liquid()
  it('should throw when not closed', async function () {
    const p = liquid.parseAndRender('{% raw %}')
    return expect(p).rejects.toThrow(/{% raw %} not closed/)
  })
  it('should output filters as it is', async function () {
    const src = '{% raw %}{{ 5 | plus: 6 }}{% endraw %} is equal to 11.'
    const dst = '{{ 5 | plus: 6 }} is equal to 11.'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })
  it('should preserve blank characters', async function () {
    const src = '{% raw %}\n{{ foo}} \n{% endraw %}'
    const dst = '\n{{ foo}} \n'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })
  it('should support sync', function () {
    const html = liquid.parseAndRenderSync('{% raw %}{{foo}}{% endraw %}')
    return expect(html).toBe('{{foo}}')
  })
})
