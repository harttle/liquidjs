const chai = require('chai')
const expect = chai.expect
const assert = require('../../src/util/assert.js')

describe('assert', function () {
  it('should not throw if predicate is truthy', function () {
    var fn = () => assert('foo', 'bar')
    expect(fn).to.not.throw()
  })
  it('should not throw if predicate is truthy', function () {
    var fn = () => assert('', 'bar')
    expect(fn).to.throw(/bar/)
  })
  it('should populate default message', function () {
    var fn = () => assert(false)
    expect(fn).to.throw(/expect false to be true/)
  })
})
