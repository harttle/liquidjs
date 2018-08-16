const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/unless', function () {
  let liquid = Liquid()

  it('should render else when predicate yields true', function () {
    // 0 is truthy
    let src = '{% unless 0 %}yes{%else%}no{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('no')
  })
  it('should render unless when predicate yields false', function () {
    let src = '{% unless false %}yes{%else%}no{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('yes')
  })
  it('should reject when tag not closed', function () {
    let src = '{% unless 1>2 %}yes'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag {% unless 1>2 %} not closed/)
  })
  it('should render unless when predicate yields false and else undefined', function () {
    let src = '{% unless 1>2 %}yes{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('yes')
  })
  it('should render "" when predicate yields false and else undefined', function () {
    let src = '{% unless 1<2 %}yes{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
})
