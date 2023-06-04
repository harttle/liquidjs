const LiquidUMD = require('../../dist/liquid.browser.umd.js').Liquid

describe('browser', function () {
  it('should yield unclosed output error', () => {
    const engine = new LiquidUMD()
    return expect(engine.parseAndRender('{{huh')).rejects.toMatchObject({
      message: 'output "{{huh" not closed, line:1, col:1'
    })
  })
})
