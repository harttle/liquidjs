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
      .rejects.toThrow(/empty candidates/)
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
  it('should support sync', function () {
    const src = "{% cycle '1', '2', '3' %}"
    const html = liquid.parseAndRenderSync(src + src + src + src)
    return expect(html).toBe('1231')
  })
})
