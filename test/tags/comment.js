const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/comment', function () {
  var liquid = Liquid()
  it('should support empty content', function () {
    var src = '{% comment %}{% raw%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/{% comment %} not closed/)
  })
  it('should ignore plain string', function () {
    var src = 'My name is {% comment %}super{% endcomment %} Shopify.'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('My name is  Shopify.')
  })
  it('should ignore output tokens', function () {
    var src = '{% comment %}\n{{ foo}} \n{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
  it('should ignore tag tokens', function () {
    var src = '{% comment %}{%if true%}true{%else%}false{%endif%}{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
  it('should ignore un-balenced tag tokens', function () {
    var src = '{% comment %}{%if true%}true{%else%}false{% endcomment %}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
})
