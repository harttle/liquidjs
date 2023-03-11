import { assert } from './assert'

describe('assert', function () {
  it('should not throw if predicate is truthy', function () {
    const fn = () => assert('foo', () => 'bar')
    expect(fn).not.toThrow()
  })
  it('should not throw if predicate is truthy', function () {
    const fn = () => assert('', () => 'bar')
    expect(fn).toThrow(/bar/)
  })
  it('should populate default message', function () {
    const fn = () => assert(false)
    expect(fn).toThrow(/expect false to be true/)
  })
})
