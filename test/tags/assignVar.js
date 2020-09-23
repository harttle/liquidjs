const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/assignVar', function () {
  const liquid = Liquid()
  it('should throw when variable expression illegal', function () {
    const src = '{% assignVar / %}'
    const ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })

  it('should assignVar as string', function () {
    const ctx = {foo: "bar"}
    const src = '{% assignVar foo2="foo" %}{{foo2}}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('bar')
  })
  it('should assignVar as array', function () {
    const ctx = {arr: [1,2,3]}
    const src = '{% assignVar foo="arr" %}{{foo}}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('[1,2,3]')
  })
})
