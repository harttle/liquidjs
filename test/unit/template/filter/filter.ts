import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Context } from '../../../../src/context/context'
import { toThenable } from '../../../../src/util/async'
import { FilterMap } from '../../../../src/template/filter/filter-map'

chai.use(sinonChai)
const expect = chai.expect

describe('filter', function () {
  let ctx: Context
  let filters: FilterMap
  beforeEach(function () {
    filters = new FilterMap(false)
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
    await toThenable(filters.create('foo', ['33']).render('foo', ctx))
    expect(spy).to.have.been.calledWith('foo', 33)
  })
  it('should call filter impl with correct this arg', async function () {
    const spy = sinon.spy()
    filters.set('foo', spy)
    await toThenable(filters.create('foo', ['33']).render('foo', ctx))
    expect(spy).to.have.been.calledOn(sinon.match.has('context', ctx))
  })
  it('should render a simple filter', async function () {
    filters.set('upcase', x => x.toUpperCase())
    expect(await toThenable(filters.create('upcase', []).render('foo', ctx))).to.equal('FOO')
  })

  it('should render filters with argument', async function () {
    filters.set('add', (a, b) => a + b)
    expect(await toThenable(filters.create('add', ['2']).render(3, ctx))).to.equal(5)
  })

  it('should render filters with multiple arguments', async function () {
    filters.set('add', (a, b, c) => a + b + c)
    expect(await toThenable(filters.create('add', ['2', '"c"']).render(3, ctx))).to.equal('5c')
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
    expect(await toThenable((filters.create('add', [['num', '2']]).render(3, ctx)))).to.equal('num:5')
  })
})
