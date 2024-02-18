import { Liquid } from '../../../src/liquid'

describe('tags/unless', function () {
  let liquid: Liquid
  beforeEach(() => { liquid = new Liquid() })

  it('should render else when predicate yields true', async function () {
    // 0 is truthy
    const src = '{% unless 0 %}yes{%else%}no{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('no')
  })
  it('should support elsif', async function () {
    const src = '{% unless true %}1{%elsif true%}2{%else%}3{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('2')
  })
  it('should render unless when predicate yields false', async function () {
    const src = '{% unless false %}yes{%else%}no{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('yes')
  })
  it('should reject when tag not closed', function () {
    const src = '{% unless 1 > 2 %}yes'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/tag {% unless 1 > 2 %} not closed/)
  })
  it('should render unless when predicate yields false and else undefined', async function () {
    const src = '{% unless 1 > 2 %}yes{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('yes')
  })
  it('should render "" when predicate yields false and else undefined', async function () {
    const src = '{% unless 1 < 2 %}yes{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('')
  })

  it('should output unless contents in order', async function () {
    const src = `
      Before {{ location }}
      {% unless false %}Inside {{ location }}{% endunless %}
      After {{ location }}`
    const html = await liquid.parseAndRender(src, { location: 'wonderland' })
    expect(html).toBe(`
      Before wonderland
      Inside wonderland
      After wonderland`)
  })
  it('should not render anything after an else branch', async function () {
    const html = await liquid.parseAndRenderSync('{% assign value = "this" %}' +
      '{% unless true %}don\'t show' +
      '{% else %}show {{ value }}' +
      '{% else %}don\'t show' +
    '{% endunless %}', {})
    expect(html).toEqual('show this')
  })
  it('should not render anything after an else branch even when first else branch is empty', async function () {
    const html = await liquid.parseAndRenderSync('{% unless true %}don\'t show' +
      '{% else %}' +
      '{% else %}don\'t show' +
    '{% endunless %}', {})
    expect(html).toEqual('')
  })
  it('should not render an elseif after an else branch', () => {
    const engine = new Liquid()
    const result = engine.parseAndRenderSync('{% unless true %}don\'t show' +
      '{% else %}show' +
      '{% elsif true %}don\'t show' +
    '{% endunless %}', {})
    expect(result).toEqual('show')
  })

  describe('sync support', function () {
    it('should render else when predicate yields true', function () {
      const src = '{% unless 0 %}yes{%else%}no{%endunless%}'
      const html = liquid.parseAndRenderSync(src)
      expect(html).toBe('no')
    })
    it('should render unless when predicate yields false', function () {
      const src = '{% unless false %}yes{%else%}no{%endunless%}'
      const html = liquid.parseAndRenderSync(src)
      expect(html).toBe('yes')
    })
  })
})
