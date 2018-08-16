const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/case', function () {
  let liquid = Liquid()

  it('should reject if not closed', function () {
    let src = '{% case "foo"%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/{% case "foo"%} not closed/)
  })
  it('should hit the specified case', function () {
    let src = '{% case "foo"%}' +
            '{% when "foo" %}foo{% when "bar"%}bar' +
            '{%endcase%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('foo')
  })
  it('should resolve empty string if not hit', function () {
    let src = '{% case empty %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}'
    let ctx = {
      empty: ''
    }
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('bar')
  })
  it('should accept empty string as branch name', function () {
    let src = '{% case false %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('')
  })
  it('should support boolean case', function () {
    let src = '{% case false %}' +
            '{% when "foo" %}foo{% when false%}bar' +
            '{%endcase%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('bar')
  })
  it('should support else branch', function () {
    let src = '{% case "a" %}' +
            '{% when "b" %}b{% when "c"%}c{%else %}d' +
            '{%endcase%}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('d')
  })
})
