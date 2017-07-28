const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/cycle', function () {
  var liquid = Liquid()

  it('should support cycle', function () {
    var src = "{% cycle '1', '2', '3' %}"
    return expect(liquid.parseAndRender(src + src + src + src))
      .to.eventually.equal('1231')
  })

  it('should throw when cycle candidates empty', function () {
    return expect(liquid.parseAndRender('{%cycle%}'))
      .to.be.rejectedWith(/empty candidates/)
  })

  it('should support cycle in for block', function () {
    var src = '{% for i in (1..5) %}{% cycle one, "e"%}{% endfor %}'
    var ctx = {
      one: 1
    }
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('1e1e1')
  })

  it('should support cycle group', function () {
    var src = "{% cycle one: '1', '2', '3'%}" +
            "{% cycle 1: '1', '2', '3'%}" +
            "{% cycle 2: '1', '2', '3'%}"
    var ctx = {
      one: 1
    }
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('121')
  })
})
