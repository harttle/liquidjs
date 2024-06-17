import { toPromise, toValueSync } from './async'

describe('utils/async', () => {
  describe('#toPromise()', function () {
    it('should return a promise', async () => {
      function * foo () {
        return 'foo'
      }
      const result = await toPromise(foo())
      expect(result).toBe('foo')
    })
    it('should support iterable with single return statement', async () => {
      function * foo () {
        return 'foo'
      }
      const result = await toPromise(foo())
      expect(result).toBe('foo')
    })
    it('should support promise', async () => {
      function foo () {
        return Promise.resolve('foo')
      }
      const result = await toPromise(foo())
      expect(result).toBe('foo')
    })
    it('should resolve dependency', async () => {
      function * foo (): Generator<Generator<string>> {
        return yield bar()
      }
      function * bar (): Generator<string> {
        return 'bar'
      }
      const result = await toPromise(foo())
      expect(result).toBe('bar')
    })
    it('should support promise dependency', async () => {
      function * foo (): Generator<Promise<string>> {
        return yield Promise.resolve('foo')
      }
      const result = await toPromise(foo())
      expect(result).toBe('foo')
    })
    it('should reject Promise if dependency throws synchronously', done => {
      function * foo (): Generator<Generator<never>> {
        return yield bar()
      }
      function * bar (): Generator<never> {
        throw new Error('bar')
      }
      toPromise(foo()).catch(err => {
        expect(err.message).toBe('bar')
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
      function * bar (): Generator<never> {
        throw new Error('bar')
      }
      const ret = await toPromise(foo())
      expect(ret).toBe('barfoo')
    })
  })
  describe('#toValueSync()', function () {
    it('should throw Error if dependency throws synchronously', () => {
      function * foo (): Generator<Generator<never>> {
        return yield bar()
      }
      function * bar (): Generator<never> {
        throw new Error('bar')
      }
      expect(() => toValueSync(foo())).toThrow('bar')
    })
    it('should resume yield after catch', () => {
      function * foo (): Generator<unknown, never, never> {
        try {
          yield bar()
        } catch (e) {}
        return yield 'foo'
      }
      function * bar (): Generator<never> {
        throw new Error('bar')
      }
      expect(toValueSync(foo())).toBe('foo')
    })
    it('should resume return after catch', () => {
      function * foo (): Generator<Generator<never>, string> {
        try {
          yield bar()
        } catch (e) {}
        return 'foo'
      }
      function * bar (): Generator<never> {
        throw new Error('bar')
      }
      expect(toValueSync(foo())).toBe('foo')
    })
    it('should return non iterator value as it is', () => {
      expect(toValueSync('foo')).toBe('foo')
    })
  })
})
