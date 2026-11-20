import { Liquid } from '../../../src/liquid'

describe('tags/cycle', function () {
  const liquid = new Liquid()

  it('should support cycle', async function () {
    const src = "{% cycle '1', '2', '3' %}"
    const html = await liquid.parseAndRender(src + src + src + src)
    return expect(html).toBe('1231')
  })

  it('should throw when cycle candidates empty', function () {
    return expect(liquid.parseAndRender('{%cycle%}'))
      .rejects.toThrow('empty candidates: "{%cycle%}", line:1, col:8')
  })

  it('should support cycle in for block', async function () {
    const src = '{% for i in (1..5) %}{% cycle one, "e"%}{% endfor %}'
    const ctx = {
      one: 1
    }
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).toBe('1e1e1')
  })

  it('should considered different groups for different arguments', async function () {
    const src = "{% cycle '1', '2', '3'%}" +
            "{% cycle '1', '2'%}" +
            "{% cycle '1', '2', '3'%}"
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('112')
  })

  it('should support cycle group', async function () {
    const src = "{% cycle one: '1', '2', '3'%}" +
            "{% cycle 1: '1', '2', '3'%}" +
            "{% cycle 2: '1', '2', '3'%}"
    const ctx = { one: 1 }
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).toBe('121')
  })

  it('should share a named group across different arguments', async function () {
    const src = "{% cycle 'a': 1, 2, 3 %}" +
      "{% cycle 'a': 7, 8, 9 %}" +
      "{% cycle 'a': 1, 2, 3 %}"
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('183')
  })

  it('should support a named group with different argument counts', async function () {
    const src = "{% cycle a: '1', '2' %}" +
      "{% cycle a: '1', '2', '3' %}" +
      "{% cycle a: '1' %}"
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('12')
  })

  it('should support a named group with fewer arguments', async function () {
    const src = "{% cycle a: '1', '2', '3' %}" +
      "{% cycle a: '1', '2' %}" +
      "{% cycle a: '1' %}"
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('121')
  })

  it('should support a named group with more arguments', async function () {
    const src = "{% cycle a: '1' %}" +
      "{% cycle a: '1', '2' %}" +
      "{% cycle a: '1', '2', '3' %}"
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('112')
  })

  it('should reset a named group after an out-of-range argument', async function () {
    const src = "{% cycle 'a': 1, 2, 3, 4, 5 %}".repeat(4) +
      "{% cycle 'a': 'a', 'b' %}{% cycle 'a': 'a', 'b' %}"
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('1234a')
  })

  it('should support sync', function () {
    const src = "{% cycle '1', '2', '3' %}"
    const html = liquid.parseAndRenderSync(src + src + src + src)
    return expect(html).toBe('1231')
  })
})
