import { Liquid } from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/cycle', function () {
  const liquid = new Liquid()

  it('should support cycle', async function () {
    const src = "{% cycle '1', '2', '3' %}"
    const html = await liquid.parseAndRender(src + src + src + src)
    return expect(html).to.equal('1231')
  })

  it('should throw when cycle candidates empty', function () {
    return expect(liquid.parseAndRender('{%cycle%}'))
      .to.be.rejectedWith(/empty candidates/)
  })

  it('should support cycle in for block', async function () {
    const src = '{% for i in (1..5) %}{% cycle one, "e"%}{% endfor %}'
    const ctx = {
      one: 1
    }
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('1e1e1')
  })

  it('should considered different groups for different arguments', async function () {
    const src = "{% cycle '1', '2', '3'%}" +
            "{% cycle '1', '2'%}" +
            "{% cycle '1', '2', '3'%}"
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('112')
  })

  it('should support cycle group', async function () {
    const src = "{% cycle one: '1', '2', '3'%}" +
            "{% cycle 1: '1', '2', '3'%}" +
            "{% cycle 2: '1', '2', '3'%}"
    const ctx = { one: 1 }
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('121')
  })
  it('should support sync', function () {
    const src = "{% cycle '1', '2', '3' %}"
    const html = liquid.parseAndRenderSync(src + src + src + src)
    return expect(html).to.equal('1231')
  })
})
