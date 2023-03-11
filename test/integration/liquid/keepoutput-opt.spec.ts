import { Liquid } from '../../../src/liquid'

describe('LiquidOptions#*keepOutputType*', function () {
  it('should respect keepOutputType', async function () {
    const engine = new Liquid({
      keepOutputType: true
    })
    const context = {
      'my-boolean': true,
      'my-number': 42,
      'my-string': 'test'
    }
    const booleanHtml = await engine.parseAndRender('{{my-boolean}}', context)
    expect(booleanHtml).toBe(true)
    const numberHtml = await engine.parseAndRender('{{my-number}}', context)
    expect(numberHtml).toBe(42)
    const html = await engine.parseAndRender('{{my-string}}', context)
    expect(html).toBe('test')
    const composedHtml = await engine.parseAndRender('{{my-string}}:{{my-number}}', context)
    expect(composedHtml).toBe('test:42')
  })

  it('should respect keepOutputType = false as default', async function () {
    const engine = new Liquid()
    const context = {
      'my-boolean': true,
      'my-number': 42,
      'my-string': 'test'
    }
    const booleanHtml = await engine.parseAndRender('{{my-boolean}}', context)
    expect(booleanHtml).toBe('true')
    const numberHtml = await engine.parseAndRender('{{my-number}}', context)
    expect(numberHtml).toBe('42')
    const html = await engine.parseAndRender('{{my-string}}', context)
    expect(html).toBe('test')
    const composedHtml = await engine.parseAndRender('{{my-string}}:{{my-number}}', context)
    expect(composedHtml).toBe('test:42')
  })
})
