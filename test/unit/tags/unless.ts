import Liquid from 'src/liquid'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/unless', function () {
  let liquid
  before(() => { liquid = new Liquid() })

  it('should render else when predicate yields true', function () {
    // 0 is truthy
    const src = '{% unless 0 %}yes{%else%}no{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('no')
  })
  it('should render unless when predicate yields false', function () {
    const src = '{% unless false %}yes{%else%}no{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('yes')
  })
  it('should reject when tag not closed', function () {
    const src = '{% unless 1>2 %}yes'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag {% unless 1>2 %} not closed/)
  })
  it('should render unless when predicate yields false and else undefined', function () {
    const src = '{% unless 1>2 %}yes{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('yes')
  })
  it('should render "" when predicate yields false and else undefined', function () {
    const src = '{% unless 1<2 %}yes{%endunless%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
})
