import { Liquid } from '../../../src/liquid'
import { TokenizationError } from '../../../src'

describe('tags/assign', function () {
  const liquid = new Liquid()
  it('should throw when variable name illegal', function () {
    const src = '{% assign / %}'
    const ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).rejects.toThrow(/expected variable name/)
  })
  it('should support assign to a string', async function () {
    const src = '{% assign foo="bar" %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('bar')
  })
  it('should throw when variable value illegal', function () {
    const src = '{% assign foo = “bar” %}'
    expect(() => liquid.parse(src)).toThrow(/invalid value expression: "“bar”"/)
    expect(() => liquid.parse(src)).toThrow(TokenizationError)
  })
  it('should support assign to a number', async function () {
    const src = '{% assign foo=10086 %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('10086')
  })
  it('should assign as array', async function () {
    const src = '{% assign foo=(1..3) %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('123')
  })
  it('should assign as filter result', async function () {
    const src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('A')
  })
  it('should assign as filter across multiple lines as result', async function () {
    const src = `{% assign foo="a b"
    | capitalize
    | split: " "
    | first %}{{foo}}`
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('A')
  })
  it('should assign var-1', async function () {
    const src = '{% assign var-1 = 5 %}{{ var-1 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('5')
  })
  it('should assign var-', async function () {
    const src = '{% assign var- = 5 %}{{ var- }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('5')
  })
  it('should assign -var', async function () {
    const src = '{% assign -let = 5 %}{{ -let }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('5')
  })
  it('should assign -5-5', async function () {
    const src = '{% assign -5-5 = 5 %}{{ -5-5 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('5')
  })
  it('should assign 4-3', async function () {
    const src = '{% assign 4-3 = 5 %}{{ 4-3 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('5')
  })
  it('should not assign -6', async function () {
    const src = '{% assign -6 = 5 %}{{ -6 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('-6')
  })
  it('should allow reassignment', async function () {
    const src = '{% assign var = 1 %}{% assign var = 2 %}{{ var }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('2')
  })
  describe('scope', function () {
    it('should read from parent scope', async function () {
      const src = '{%for a in (1..2)%}{{num}}{%endfor%}'
      const html = await liquid.parseAndRender(src, { num: 1 })
      return expect(html).toBe('11')
    })
    it('should write to the root scope', async function () {
      const src = '{%for a in (1..2)%}{%assign num = a%}{{a}}{%endfor%}'
      const html = await liquid.parseAndRender(src, { num: 1 })
      return expect(html).toBe('12')
    })
    it('should not change input scope', async function () {
      const src = '{%for a in (1..2)%}{%assign num = a%}{{a}}{%endfor%} {{num}}'
      const ctx = { num: 1 }
      await liquid.parseAndRender(src, ctx)
      return expect(ctx.num).toBe(1)
    })
  })
  it('should support sync', function () {
    const src = '{% assign foo="bar" %}{{foo}}'
    const html = liquid.parseAndRenderSync(src)
    return expect(html).toBe('bar')
  })
})
