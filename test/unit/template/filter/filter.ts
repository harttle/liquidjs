import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Context } from '../../../../src/context/context'
import { toThenable } from '../../../../src/util/async'
import { NumberToken } from '../../../../src/tokens/number-token'
import { QuotedToken } from '../../../../src/tokens/quoted-token'
import { IdentifierToken } from '../../../../src/tokens/identifier-token'
import { FilterMap } from '../../../../src/template/filter/filter-map'

chai.use(sinonChai)
const expect = chai.expect

describe('filter', function () {
  let ctx: Context
  let filters: FilterMap
  const liquid = {} as any
  beforeEach(function () {
    filters = new FilterMap(false, liquid)
    ctx = new Context()
  })
  it('should create default filter if not registered', async function () {
    const result = filters.create('foo', []) as any
    expect(result.name).to.equal('foo')
  })

  it('should render input if filter not registered', async function () {
    expect(await toThenable(filters.create('undefined', []).render('foo', ctx))).to.equal('foo')
  })

  it('should call filter impl with correct arguments', async function () {
    const spy = sinon.spy()
    filters.set('foo', spy)
    const thirty = new NumberToken(new IdentifierToken('30', 0, 2), undefined)
    await toThenable(filters.create('foo', [thirty]).render('foo', ctx))
    expect(spy).to.have.been.calledWith('foo', 30)
  })
  it('should call filter impl with correct this', async function () {
    const spy = sinon.spy()
    filters.set('foo', spy)
    const thirty = new NumberToken(new IdentifierToken('33', 0, 2), undefined)
    await toThenable(filters.create('foo', [thirty]).render('foo', ctx))
    expect(spy).to.have.been.calledOn(sinon.match.has('context', ctx))
    expect(spy).to.have.been.calledOn(sinon.match.has('liquid', liquid))
  })
  it('should render a simple filter', async function () {
    filters.set('upcase', x => x.toUpperCase())
    expect(await toThenable(filters.create('upcase', []).render('foo', ctx))).to.equal('FOO')
  })

  it('should render filters with argument', async function () {
    filters.set('add', (a, b) => a + b)
    const two = new NumberToken(new IdentifierToken('2', 0, 1), undefined)
    expect(await toThenable(filters.create('add', [two]).render(3, ctx))).to.equal(5)
  })

  it('should render filters with multiple arguments', async function () {
    filters.set('add', (a, b, c) => a + b + c)
    const two = new NumberToken(new IdentifierToken('2', 0, 1), undefined)
    const c = new QuotedToken('"c"', 0, 3)
    expect(await toThenable(filters.create('add', [two, c]).render(3, ctx))).to.equal('5c')
  })

  it('should pass Objects/Drops as it is', async function () {
    filters.set('name', a => a.constructor.name)
    class Foo {}
    expect(await toThenable(filters.create('name', []).render(new Foo(), ctx))).to.equal('Foo')
  })

  it('should not throw when filter name illegal', function () {
    expect(function () {
      filters.create('/', [])
    }).to.not.throw()
  })

  it('should support key value pairs', async function () {
    filters.set('add', (a, b) => b[0] + ':' + (a + b[1]))
    const two = new NumberToken(new IdentifierToken('2', 0, 1), undefined)
    expect(await toThenable((filters.create('add', [['num', two]]).render(3, ctx)))).to.equal('num:5')
  })
})
