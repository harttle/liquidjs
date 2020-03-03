import { expect } from 'chai'
import { LRU } from '../../../src/cache/lru'

describe('LRU', () => {
  it('should perform read()/write()', () => {
    const lru = new LRU(2)
    expect(lru.limit).to.equal(2)

    lru.write('foo', 'FOO')
    lru.write('bar', 'BAR')
    expect(lru.read('foo')).to.equal('FOO')
    expect(lru.read('bar')).to.equal('BAR')
  })
  it('should perform clear()', () => {
    const lru = new LRU(2)
    lru.write('foo', 'FOO')
    lru.write('bar', 'BAR')
    expect(lru.size).to.equal(2)
    lru.clear()
    expect(lru.size).to.equal(0)
    expect(lru.read('foo')).to.be.undefined
  })
  it('should remove lrc item when full(2)', () => {
    const lru = new LRU(2)
    expect(lru.size).to.equal(0)
    lru.write('foo', 'FOO')
    expect(lru.size).to.equal(1)
    lru.write('bar', 'BAR')
    expect(lru.size).to.equal(2)
    lru.write('coo', 'COO')
    expect(lru.size).to.equal(2)
    expect(lru.read('foo')).to.be.undefined
    expect(lru.read('bar')).to.equal('BAR')
    expect(lru.read('coo')).to.equal('COO')
  })
})
