const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/increment', function () {
  var liquid = Liquid()

  it('should support increment', function () {
    var src = '{% increment one %}{{one}}'
    var ctx = {
      one: 1
    }
    return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('2')
  })

  it('should increment undefined', function () {
    var src = '{% increment empty %}{{empty}}'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal('1')
  })

  it('should support increment multiple times', function () {
    var src = '{% increment foo %}{%increment foo%}{{foo}}'
    var ctx = {
      foo: 1
    }
    return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('3')
  })
})
