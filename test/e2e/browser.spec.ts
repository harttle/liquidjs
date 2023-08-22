const LiquidUMD = require('../../dist/liquid.browser.umd.js').Liquid

describe('browser', function () {
  it('should yield unclosed output error', () => {
    const engine = new LiquidUMD()
    return expect(engine.parseAndRender('{{huh')).rejects.toMatchObject({
      message: 'output "{{huh" not closed, line:1, col:1'
    })
  })
  it('should throw tokenization error for invalid filter syntax', async () => {
    const engine = new LiquidUMD()
    const message = 'expected filter name, line:1, col:10'
    const stack = [
      '>> 1| {{ foo | ^ }}',
      '               ^',
      `TokenizationError: ${message}`
    ].join('\n')
    await expect(engine.parseAndRender('{{ foo | ^ }}')).rejects.toMatchObject({
      message,
      stack: expect.stringContaining(stack),
      name: 'TokenizationError'
    })
  })
})
