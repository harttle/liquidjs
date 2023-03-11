import { Liquid } from '../liquid'
import { QuotedToken } from '../tokens'
import { toPromise } from '../util'
import { Context } from '../context'
import { Value } from '../template'

describe('Value', function () {
  const liquid = new Liquid()

  describe('#constructor()', function () {
    it('should parse filters in value content', function () {
      const f = new Value('o | foo: a: "a"', liquid)
      expect(f.filters[0].name).toBe('foo')
      expect(f.filters[0].args).toHaveLength(1)
      const [k, v] = f.filters[0].args[0] as any
      expect(k).toBe('a')
      expect(v).toBeInstanceOf(QuotedToken)
      expect((v as QuotedToken).getText()).toBe('"a"')
    })
  })

  describe('#value()', function () {
    it('should call chained filters correctly', async function () {
      const date = jest.fn(() => 'y')
      const time = jest.fn()
      liquid.registerFilter('date', date)
      liquid.registerFilter('time', time)
      const tpl = new Value('foo.bar | date: "b" | time:2', liquid)
      const scope = new Context({
        foo: { bar: 'bar' }
      })
      await toPromise(tpl.value(scope, false))
      expect(date).toHaveBeenCalledWith('bar', 'b')
      expect(time).toHaveBeenCalledWith('y', 2)
    })
  })
})
