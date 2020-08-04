import { toThenable, toPromise, toValue } from '../../../src/util/async'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('utils/async', () => {
  describe('#toPromise()', function () {
    it('should return a promise', async () => {
      function * foo () {
        return 'foo'
      }
      const result = await toPromise(foo())
      expect(result).to.equal('foo')
    })
  })
  describe('#toThenable()', function () {
    it('should support iterable with single return statement', async () => {
      function * foo () {
        return 'foo'
      }
      const result = await toThenable(foo())
      expect(result).to.equal('foo')
    })
    it('should support promise', async () => {
      function foo () {
        return Promise.resolve('foo')
      }
      const result = await toThenable(foo())
      expect(result).to.equal('foo')
    })
    it('should resolve dependency', async () => {
      function * foo () {
        return yield bar()
      }
      function * bar () {
        return 'bar'
      }
      const result = await toThenable(foo())
      expect(result).to.equal('bar')
    })
    it('should support promise dependency', async () => {
      function * foo () {
        return yield Promise.resolve('foo')
      }
      const result = await toThenable(foo())
      expect(result).to.equal('foo')
    })
    it('should reject Promise if dependency throws syncly', done => {
      function * foo () {
        return yield bar()
      }
      function * bar (): IterableIterator<any> {
        throw new Error('bar')
      }
      toThenable(foo()).catch(err => {
        expect(err.message).to.equal('bar')
        done()
        return 0 as any
      })
    })
    it('should resume promise after catch', async () => {
      function * foo () {
        let ret = ''
        try {
          yield bar()
        } catch (e) {
          ret += 'bar'
        }
        ret += 'foo'
        return ret
      }
      function * bar (): IterableIterator<any> {
        throw new Error('bar')
      }
      const ret = await toThenable(foo())
      expect(ret).to.equal('barfoo')
    })
  })
  describe('#toValue()', function () {
    it('should throw Error if dependency throws syncly', () => {
      function * foo () {
        return yield bar()
      }
      function * bar (): IterableIterator<any> {
        throw new Error('bar')
      }
      expect(() => toValue(foo())).to.throw('bar')
    })
    it('should resume yield after catch', () => {
      function * foo () {
        try {
          yield bar()
        } catch (e) {}
        return yield 'foo'
      }
      function * bar (): IterableIterator<any> {
        throw new Error('bar')
      }
      expect(toValue(foo())).to.equal('foo')
    })
    it('should resume return after catch', () => {
      function * foo () {
        try {
          yield bar()
        } catch (e) {}
        return 'foo'
      }
      function * bar (): IterableIterator<any> {
        throw new Error('bar')
      }
      expect(toValue(foo())).to.equal('foo')
    })
  })
})
