import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import Scope from '../../src/scope/scope'
import Output from '../../src/template/output'
import Filter from 'src/template/filter'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const expect = chai.expect

describe('Output', function () {
  beforeEach(function () {
    Filter.clear()
  })

  it('should respect to .to_liquid() method', function () {
    const scope = new Scope({
      bar: { to_liquid: x => 'custom' }
    })
    return expect(new Output({value: 'bar'}).render(scope)).to.eventually.equal('custom')
  })
  it('should stringify objects', function () {
    const scope = new Scope({
      foo: { obj: { arr: ['a', 2] } }
    })
    return expect(new Output({value: 'foo'}).render(scope)).to.eventually.equal('{"obj":{"arr":["a",2]}}')
  })
  it('should skip circular property', function () {
    const ctx = { foo: { num: 2 }, bar: 'bar' } as any
    ctx.foo.circular = ctx
    const scope = new Scope(ctx)
    return expect(new Output({value: 'foo'}).render(scope)).to.eventually.equal('{"num":2,"circular":{"bar":"bar"}}')
  })
  it('should skip function property', function () {
    const scope = new Scope({ obj: { foo: 'foo', bar: x => x } })
    return expect(new Output({value: 'obj'}).render(scope)).to.eventually.equal('{"foo":"foo"}')
  })
  it('should respect to .toString()', async () => {
    const scope = new Scope({ obj: { toString: () => 'FOO' } })
    const str = await new Output({value: 'obj'}).render(scope)
    return expect(str).to.equal('FOO')
  })
  it('should respect to .to_s()', async () => {
    const scope = new Scope({ obj: { to_s: () => 'FOO' } })
    const str = await new Output({value: 'obj'}).render(scope)
    return expect(str).to.equal('FOO')
  })
  it('should respect to .liquid_method_missing()', async () => {
    const scope = new Scope({ obj: { liquid_method_missing: x => x.toUpperCase() } })
    const str = await new Output({value: 'obj.foo'}).render(scope)
    return expect(str).to.equal('FOO')
  })
})
