import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Filter } from '../../../../src/template/filter/filter'
import Context from '../../../../src/context/context'

chai.use(sinonChai)
const expect = chai.expect

describe('filter', function () {
  let ctx: Context
  beforeEach(function () {
    Filter.clear()
    ctx = new Context()
  })
  it('should create default filter if not registered', async function () {
    const result = new Filter('foo', [], false)
    expect(result.name).to.equal('foo')
  })

  it('should render input if filter not registered', async function () {
    expect(await new Filter('undefined', [], false).render('foo', ctx)).to.equal('foo')
  })

  it('should call filter impl with correct arguments', async function () {
    const spy = sinon.spy()
    Filter.register('foo', spy)
    await new Filter('foo', ['33'], false).render('foo', ctx)
    expect(spy).to.have.been.calledWith('foo', 33)
  })
  it('should call filter impl with correct this arg', async function () {
    const spy = sinon.spy()
    Filter.register('foo', spy)
    await new Filter('foo', ['33'], false).render('foo', ctx)
    expect(spy).to.have.been.calledOn(sinon.match.has('context', ctx))
  })
  it('should render a simple filter', async function () {
    Filter.register('upcase', x => x.toUpperCase())
    expect(await new Filter('upcase', [], false).render('foo', ctx)).to.equal('FOO')
  })

  it('should render filters with argument', async function () {
    Filter.register('add', (a, b) => a + b)
    expect(await new Filter('add', ['2'], false).render(3, ctx)).to.equal(5)
  })

  it('should render filters with multiple arguments', async function () {
    Filter.register('add', (a, b, c) => a + b + c)
    expect(await new Filter('add', ['2', '"c"'], false).render(3, ctx)).to.equal('5c')
  })

  it('should not throw when filter name illegal', function () {
    expect(function () {
      new Filter('/', [], false)
    }).to.not.throw()
  })
})
