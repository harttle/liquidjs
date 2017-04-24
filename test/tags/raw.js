const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/raw', function () {
  var liquid = Liquid()
  it('should support raw 1', function () {
    return expect(liquid.parseAndRender('{% raw%}'))
            .to.be.rejectedWith(/{% raw%} not closed/)
  })
  it('should support raw 2', function () {
    var src = '{% raw %}{{ 5 | plus: 6 }}{% endraw %} is equal to 11.'
    var dst = '{{ 5 | plus: 6 }} is equal to 11.'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal(dst)
  })
  it('should support raw 3', function () {
    var src = '{% raw %}\n{{ foo}} \n{% endraw %}'
    var dst = '\n{{ foo}} \n'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal(dst)
  })
})
