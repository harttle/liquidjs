import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Context } from '../../../../src/context'
import { toPromise } from '../../../../src/util'
import { IdentifierToken, NumberToken, QuotedToken } from '../../../../src/tokens'
import { Filter } from '../../../../src/template'

chai.use(sinonChai)
const expect = chai.expect

describe('filter', function () {
  const ctx = new Context()
  const liquid = {} as any
  it('should not change input if filter not registered', async function () {
    const filter = new Filter('foo', undefined as any, [], liquid)
    expect(await toPromise(filter.render('value', ctx))).to.equal('value')
  })

  it('should call filter impl with correct arguments', async function () {
    const spy = sinon.spy()
    const thirty = new NumberToken(new IdentifierToken('30', 0, 2), undefined)
    const filter = new Filter('foo', spy, [thirty], liquid)
    await toPromise(filter.render('foo', ctx))
    expect(spy).to.have.been.calledWith('foo', 30)
  })
  it('should call filter impl with correct this', async function () {
    const spy = sinon.spy()
    const thirty = new NumberToken(new IdentifierToken('33', 0, 2), undefined)
    await toPromise(new Filter('foo', spy, [thirty], liquid).render('foo', ctx))
    expect(spy).to.have.been.calledOn(sinon.match.has('context', ctx))
    expect(spy).to.have.been.calledOn(sinon.match.has('liquid', liquid))
  })
  it('should render a simple filter', async function () {
    expect(await toPromise(new Filter('upcase', (x: string) => x.toUpperCase(), [], liquid).render('foo', ctx))).to.equal('FOO')
  })

  it('should render filters with argument', async function () {
    const two = new NumberToken(new IdentifierToken('2', 0, 1), undefined)
    expect(await toPromise(new Filter('add', (a: number, b: number) => a + b, [two], liquid).render(3, ctx))).to.equal(5)
  })

  it('should render filters with multiple arguments', async function () {
    const two = new NumberToken(new IdentifierToken('2', 0, 1), undefined)
    const c = new QuotedToken('"c"', 0, 3)
    expect(await toPromise(new Filter('add', (a: number, b: number, c: number) => a + b + c, [two, c], liquid).render(3, ctx))).to.equal('5c')
  })

  it('should pass Objects/Drops as it is', async function () {
    class Foo {}
    expect(await toPromise(new Filter('name', (a: any) => a.constructor.name, [], liquid).render(new Foo(), ctx))).to.equal('Foo')
  })

  it('should support key value pairs', async function () {
    const two = new NumberToken(new IdentifierToken('2', 0, 1), undefined)
    expect(await toPromise(new Filter('add', (a: number, b: number[]) => b[0] + ':' + (a + b[1]), [['num', two]], liquid).render(3, ctx))).to.equal('num:5')
  })
})
