import * as chai from 'chai'
import { assert } from '../../../src/util/assert'

const expect = chai.expect

describe('assert', function () {
  it('should not throw if predicate is truthy', function () {
    const fn = () => assert('foo', () => 'bar')
    expect(fn).to.not.throw()
  })
  it('should not throw if predicate is truthy', function () {
    const fn = () => assert('', () => 'bar')
    expect(fn).to.throw(/bar/)
  })
  it('should populate default message', function () {
    const fn = () => assert(false)
    expect(fn).to.throw(/expect false to be true/)
  })
})
