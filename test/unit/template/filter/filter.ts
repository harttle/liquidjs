import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Filter } from '../../../../src/template/filter/filter'
import { Context } from '../../../../src/context/context'
import { toThenable } from '../../../../src/util/async'

chai.use(sinonChai)
const expect = chai.expect

describe('filter', function () {
  let ctx: Context
  beforeEach(function () {
    Filter.clear()
    ctx = new Context()
  })
  it('should create default filter if not registered', async function () {
    const result = new Filter('foo', [], false) as any
    expect(result.name).to.equal('foo')
  })

  it('should render input if filter not registered', async function () {
    expect(await toThenable(new Filter('undefined', [], false).render('foo', ctx))).to.equal('foo')
  })

  it('should call filter impl with correct arguments', async function () {
    const spy = sinon.spy()
    Filter.register('foo', spy)
    await toThenable(new Filter('foo', ['33'], false).render('foo', ctx))
    expect(spy).to.have.been.calledWith('foo', 33)
  })
  it('should call filter impl with correct this arg', async function () {
    const spy = sinon.spy()
    Filter.register('foo', spy)
    await toThenable(new Filter('foo', ['33'], false).render('foo', ctx))
    expect(spy).to.have.been.calledOn(sinon.match.has('context', ctx))
  })
  it('should render a simple filter', async function () {
    Filter.register('upcase', x => x.toUpperCase())
    expect(await toThenable(new Filter('upcase', [], false).render('foo', ctx))).to.equal('FOO')
  })

  it('should render filters with argument', async function () {
    Filter.register('add', (a, b) => a + b)
    expect(await toThenable(new Filter('add', ['2'], false).render(3, ctx))).to.equal(5)
  })

  it('should render filters with multiple arguments', async function () {
    Filter.register('add', (a, b, c) => a + b + c)
    expect(await toThenable(new Filter('add', ['2', '"c"'], false).render(3, ctx))).to.equal('5c')
  })

  it('should pass Objects/Drops as it is', async function () {
    Filter.register('name', a => a.constructor.name)
    class Foo {}
    expect(await toThenable(new Filter('name', [], false).render(new Foo(), ctx))).to.equal('Foo')
  })

  it('should not throw when filter name illegal', function () {
    expect(function () {
      new Filter('/', [], false)
    }).to.not.throw()
  })

  it('should support key value pairs', async function () {
    Filter.register('add', (a, b) => b[0] + ':' + (a + b[1]))
    expect(await toThenable((new Filter('add', [['num', '2']], false).render(3, ctx)))).to.equal('num:5')
  })
})
