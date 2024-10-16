import { Context } from '../context'
import { toPromise } from '../util'
import { NumberToken, QuotedToken } from '../tokens'
import { Filter } from './filter'

describe('filter', function () {
  const ctx = new Context({ thirty: 30 })
  const liquid = { testVersion: '1.0' } as any
  it('should not change input if filter not registered', async function () {
    const filter = new Filter({ name: 'foo', args: [] } as any, undefined as any, liquid)
    expect(await toPromise(filter.render('value', ctx))).toBe('value')
  })

  it('should call filter impl with correct arguments', async function () {
    const spy = jest.fn()
    const thirty = new NumberToken('30', 0, 2, undefined)
    const filter = new Filter({ name: 'foo', args: [thirty] } as any, spy, liquid)
    await toPromise(filter.render('foo', ctx))
    expect(spy).toHaveBeenCalledWith('foo', 30)
  })
  it('should call filter impl with correct this', async function () {
    const spy = jest.fn(function * (valStr, diff): Generator<string> {
      const val = yield this.context._get([valStr])
      return `${this.liquid.testVersion}: ${val + diff}`
    })
    const ten = new NumberToken('10', 0, 2, undefined)
    const filter = new Filter({ name: 'add', args: [ten] } as any, spy, liquid)
    const val = await toPromise(filter.render('thirty', ctx))
    expect(val).toEqual('1.0: 40')
  })
  it('should render a simple filter', async function () {
    expect(await toPromise(new Filter({ name: 'upcase', args: [] } as any, (x: string) => x.toUpperCase(), liquid).render('foo', ctx))).toBe('FOO')
  })
  it('should reject promise when filter throws', async function () {
    const filter = new Filter({ name: 'foo', args: [] } as any, function * () { throw new Error('intended') }, liquid)
    expect(toPromise(filter.render('foo', ctx))).rejects.toMatchObject({
      message: 'intended'
    })
  })
  it('should render filters with argument', async function () {
    const two = new NumberToken('2', 0, 1, undefined)
    expect(await toPromise(new Filter({ name: 'add', args: [two] } as any, (a: number, b: number) => a + b, liquid).render(3, ctx))).toBe(5)
  })

  it('should render filters with multiple arguments', async function () {
    const two = new NumberToken('2', 0, 1, undefined)
    const c = new QuotedToken('"c"', 0, 3)
    expect(await toPromise(new Filter({ name: 'add', args: [two, c] } as any, (a: number, b: number, c: number) => a + b + c, liquid).render(3, ctx))).toBe('5c')
  })

  it('should pass Objects/Drops as it is', async function () {
    class Foo {}
    expect(await toPromise(new Filter({ name: 'name', args: [] } as any, (a: any) => a.constructor.name, liquid).render(new Foo(), ctx))).toBe('Foo')
  })

  it('should support key value pairs', async function () {
    const two = new NumberToken('2', 0, 1, undefined)
    expect(await toPromise(new Filter({ name: 'add', args: [['num', two]] } as any, (a: number, b: number[]) => b[0] + ':' + (a + b[1]), liquid).render(3, ctx))).toBe('num:5')
  })
})
