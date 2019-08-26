import { Liquid } from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/comment', function () {
  const liquid = new Liquid()
  it('should support empty content', function () {
    const src = '{% comment %}{% raw%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/{% comment %} not closed/)
  })
  it('should ignore plain string', async function () {
    const src = 'My name is {% comment %}super{% endcomment %} Shopify.'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('My name is  Shopify.')
  })
  it('should ignore output tokens', async function () {
    const src = '{% comment %}\n{{ foo}} \n{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should ignore tag tokens', async function () {
    const src = '{% comment %}{%if true%}true{%else%}false{%endif%}{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should ignore un-balenced tag tokens', async function () {
    const src = '{% comment %}{%if true%}true{%else%}false{% endcomment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  describe('sync support', function () {
    it('should ignore plain string', function () {
      const src = 'My name is {% comment %}super{% endcomment %} Shopify.'
      const html = liquid.parseAndRenderSync(src)
      return expect(html).to.equal('My name is  Shopify.')
    })
  })
})
