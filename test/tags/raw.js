import Liquid from '../../src'
import chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/raw', function () {
  let liquid = Liquid()
  it('should support raw 1', function () {
    return expect(liquid.parseAndRender('{% raw%}'))
      .to.be.rejectedWith(/{% raw%} not closed/)
  })
  it('should support raw 2', function () {
    let src = '{% raw %}{{ 5 | plus: 6 }}{% endraw %} is equal to 11.'
    let dst = '{{ 5 | plus: 6 }} is equal to 11.'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal(dst)
  })
  it('should support raw 3', function () {
    let src = '{% raw %}\n{{ foo}} \n{% endraw %}'
    let dst = '\n{{ foo}} \n'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal(dst)
  })
})
