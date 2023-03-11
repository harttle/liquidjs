import { Liquid, defaultOperators } from '../../../src'

describe('LiquidOptions#operators', function () {
  let engine: Liquid

  beforeEach(function () {
    engine = new Liquid({
      operators: {
        ...defaultOperators,
        isFooBar: (l: string, r: string) => l === 'foo' && r === 'bar'
      }
    })
  })

  it('should evaluate the default operators', async function () {
    const result = await engine.parseAndRender('{% if "foo" == "foo" %}True{% endif %}')
    expect(result).toBe('True')
  })

  it('should evaluate a custom operator', async function () {
    const first = await engine.parseAndRender('{% if "foo" isFooBar "bar" %}True{% else %}False{% endif %}')
    expect(first).toBe('True')
    const second = await engine.parseAndRender('{% if "foo" isFooBar "foo" %}True{% else %}False{% endif %}')
    expect(second).toBe('False')
  })

  it('should evaluate a custom operator with the correct precedence', async function () {
    const first = await engine.parseAndRender('{% if "foo" isFooBar "bar" or "foo" == "bar" %}True{% else %}False{% endif %}')
    expect(first).toBe('True')
    const second = await engine.parseAndRender('{% if "foo" isFooBar "foo" or "foo" == "bar" %}True{% else %}False{% endif %}')
    expect(second).toBe('False')
  })
})
