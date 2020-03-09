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
  it('should remove lrc item when full(limit=-1)', () => {
    const lru = new LRU(-1)
    lru.write('foo', 'FOO')
    lru.write('bar', 'BAR')
    expect(lru.size).to.equal(0)
    expect(lru.read('foo')).to.be.undefined
    expect(lru.read('bar')).to.be.undefined
  })
  it('should remove lrc item when full(limit=0)', () => {
    const lru = new LRU(0)
    lru.write('foo', 'FOO')
    lru.write('bar', 'BAR')
    expect(lru.size).to.equal(0)
    expect(lru.read('foo')).to.be.undefined
    expect(lru.read('bar')).to.be.undefined
  })
  it('should remove lrc item when full(limit=1)', () => {
    const lru = new LRU(1)
    lru.write('foo', 'FOO')
    lru.write('bar', 'BAR')
    expect(lru.size).to.equal(1)
    expect(lru.read('foo')).to.be.undefined
    expect(lru.read('bar')).to.equal('BAR')
  })
  it('should remove lrc item when full(limit=2)', () => {
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
  it('should overwrite item the with same key', () => {
    const lru = new LRU(2)
    lru.write('foo', 'FOO')
    expect(lru.size).to.equal(1)
    lru.write('foo', 'BAR')
    expect(lru.size).to.equal(1)
    expect(lru.read('foo')).to.equal('BAR')
  })
})
