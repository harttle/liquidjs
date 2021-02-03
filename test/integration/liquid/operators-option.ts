import { expect } from 'chai'
import { Liquid, defaultOperators } from '../../../src/liquid'

describe('LiquidOptions#operators', function () {
  let engine: Liquid

  beforeEach(function () {
    engine = new Liquid({
      operators: {
        ...defaultOperators,
        isFooBar: (l, r) => l === 'foo' && r === 'bar'
      }
    })
  })

  it('should evaluate the default operators', async function () {
    const result = await engine.parseAndRender('{% if "foo" == "foo" %}True{% endif %}')
    expect(result).to.equal('True')
  })

  it('should evaluate a custom operator', async function () {
    const result = await engine.parseAndRender('{% if "foo" isFooBar "bar" %}True{% endif %}')
    expect(result).to.equal('True')
  })
})
