import { Liquid } from '../../../src/liquid'

describe('LiquidOptions#*outputEscape*', function () {
  it('when outputEscape is not set', async function () {
    const engine = new Liquid()
    const html = await engine.parseAndRender('{{"<"}}')
    expect(html).toBe('<')
  })

  it('should escape when outputEscape="escape"', async function () {
    const engine = new Liquid({
      outputEscape: 'escape'
    })
    const html = await engine.parseAndRender('{{"<"}}')
    expect(html).toBe('&lt;')
  })

  it('should json stringify when outputEscape="json"', async function () {
    const engine = new Liquid({
      outputEscape: 'json'
    })
    const html = await engine.parseAndRender('{{"<"}}')
    expect(html).toBe('"<"')
  })

  it('should support outputEscape=Function', async function () {
    const engine = new Liquid({
      outputEscape: (v: any) => `{${v}}`
    })
    const html = await engine.parseAndRender('{{"<"}}')
    expect(html).toBe('{<}')
  })

  it('should skip escape for output with filter "| raw"', async function () {
    const engine = new Liquid({
      outputEscape: 'escape'
    })
    const html = await engine.parseAndRender('{{"<" | raw}}')
    expect(html).toBe('<')
  })

  it('should escape {% echo %} when outputEscape="escape"', async function () {
    const engine = new Liquid({
      outputEscape: 'escape'
    })
    const html = await engine.parseAndRender('{% echo x %}', { x: '<img>' })
    expect(html).toBe('&lt;img&gt;')
  })

  it('should escape {% liquid echo %} when outputEscape="escape"', async function () {
    const engine = new Liquid({
      outputEscape: 'escape'
    })
    const html = await engine.parseAndRender('{% liquid echo x %}', { x: '<img>' })
    expect(html).toBe('&lt;img&gt;')
  })

  it('should skip escape for {% echo %} with "| raw"', async function () {
    const engine = new Liquid({
      outputEscape: 'escape'
    })
    const html = await engine.parseAndRender('{% echo x | raw %}', { x: '<img>' })
    expect(html).toBe('<img>')
  })

  it('should escape {% cycle %} when outputEscape="escape"', async function () {
    const engine = new Liquid({
      outputEscape: 'escape'
    })
    const html = await engine.parseAndRender('{% cycle x, "b" %}', { x: '<img>' })
    expect(html).toBe('&lt;img&gt;')
  })
})
