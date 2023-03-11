import { Liquid } from '../../../src/liquid'

describe('tags/capture', function () {
  const liquid = new Liquid()

  it('should support capture', async function () {
    const src = '{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('A')
  })

  it('should support quoted variable name', async function () {
    const src = '{% capture "f" %}{{"a" | capitalize}}{%endcapture%}{{f}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('A')
  })

  it('should not change root scope', async function () {
    const src = '{% capture var %}10{% endcapture %}{{var}}'
    const ctx = { 'var': 20 }
    const html = await liquid.parseAndRender(src, ctx)
    expect(html).toBe('10')
    expect(ctx.var).toBe(20)
  })

  it('should throw on invalid identifier', function () {
    const src = '{% capture = %}{%endcapture%}'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/= not valid identifier/)
  })

  it('should throw when capture not closed', function () {
    const src = '{%capture c%}{{c}}'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/tag .* not closed/)
  })
  it('should support sync', function () {
    const src = '{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}'
    const html = liquid.parseAndRenderSync(src)
    return expect(html).toBe('A')
  })
})
