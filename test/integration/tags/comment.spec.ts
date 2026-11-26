import { Liquid } from '../../../src/liquid'

describe('tags/comment', function () {
  const liquid = new Liquid()
  it('should support empty content', function () {
    const src = '{% comment %}{% raw%}'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/{% comment %} not closed/)
  })
  it('should ignore plain string', async function () {
    const src = 'My name is {% comment %}super{% endcomment %} Shopify.'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('My name is  Shopify.')
  })
  it('should ignore output tokens', async function () {
    const src = '{% comment %}\n{{ foo}} \n{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('')
  })
  it('should ignore tag tokens', async function () {
    const src = '{% comment %}{%if true%}true{%else%}false{%endif%}{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('')
  })
  it('should ignore unbalanced tag tokens', async function () {
    const src = '{% comment %}{%if true%}true{%else%}false{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('')
  })
  it('should support nested comments', async function () {
    const src = 'a{% comment %}{% comment %}x{% endcomment %}y{% endcomment %}b'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('ab')
  })
  it('should support tags inside nested comments', async function () {
    const src = '{% comment %}{% comment %}{% if true %}x{% endif %}{% endcomment %}{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('')
  })
  it('should support nested comments with whitespace control', async function () {
    const src = 'a {%- comment -%} {% comment %} x {% endcomment %} {%- endcomment -%} b'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('ab')
  })
  it('should support nested comments in liquid tags', async function () {
    const src = '{% liquid\ncomment\ncomment\necho "x"\nendcomment\nendcomment\necho "y" %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('y')
  })
  it('should throw when a nested comment is not closed', function () {
    const src = '{% comment %}{% comment %}x{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/{% comment %} not closed/)
  })
  describe('sync support', function () {
    it('should ignore plain string', function () {
      const src = 'My name is {% comment %}super{% endcomment %} Shopify.'
      const html = liquid.parseAndRenderSync(src)
      return expect(html).toBe('My name is  Shopify.')
    })
  })
})
