const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/decrement', function () {
  var liquid = Liquid()

  it('should throw when variable expression illegal', function () {
    var src = '{% decrement / %}{{one}}'
    var ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })

  it('should support decrement', function () {
    var src = '{% decrement one %}{{one}}'
    var ctx = {
      one: 1
    }
    return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('0')
  })

  it('should decrement undefined', function () {
    var src = '{% decrement empty %}{{empty}}'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal('-1')
  })

  it('should support decrement multiple times', function () {
    var src = '{% decrement foo %}{%decrement foo%}{{foo}}'
    var ctx = {
      foo: 1
    }
    return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('-1')
  })
})
