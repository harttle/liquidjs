import Liquid from '../../../src'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/comment', function () {
  const liquid = new Liquid()
  it('should support empty content', function () {
    const src = '{% comment %}{% raw%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/{% comment %} not closed/)
  })
  it('should ignore plain string', function () {
    const src = 'My name is {% comment %}super{% endcomment %} Shopify.'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('My name is  Shopify.')
  })
  it('should ignore output tokens', function () {
    const src = '{% comment %}\n{{ foo}} \n{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
  it('should ignore tag tokens', function () {
    const src = '{% comment %}{%if true%}true{%else%}false{%endif%}{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
  it('should ignore un-balenced tag tokens', function () {
    const src = '{% comment %}{%if true%}true{%else%}false{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
})
