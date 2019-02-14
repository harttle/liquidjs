import Liquid from '../../../src'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/raw', function () {
  const liquid = new Liquid()
  it('should support raw 1', async function () {
    const p = liquid.parseAndRender('{% raw%}')
    return expect(p).be.rejectedWith(/{% raw%} not closed/)
  })
  it('should support raw 2', async function () {
    const src = '{% raw %}{{ 5 | plus: 6 }}{% endraw %} is equal to 11.'
    const dst = '{{ 5 | plus: 6 }} is equal to 11.'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })
  it('should support raw 3', function () {
    const src = '{% raw %}\n{{ foo}} \n{% endraw %}'
    const dst = '\n{{ foo}} \n'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })
})
