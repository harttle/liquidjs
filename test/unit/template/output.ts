import * as chai from 'chai'
import Scope from '../../../src/scope/scope'
import Output from '../../../src/template/output'
import OutputToken from '../../../src/parser/output-token'
import { Filter } from '../../../src/template/filter/filter'

const expect = chai.expect

describe('Output', function () {
  beforeEach(function () {
    Filter.clear()
  })

  it('should respect to .to_liquid() method', async function () {
    const scope = new Scope({
      bar: { to_liquid: () => 'custom' }
    })
    const output = new Output({ value: 'bar' } as OutputToken, false)
    const html = await output.render(scope)
    return expect(html).to.equal('custom')
  })
  it('should stringify objects', async function () {
    const scope = new Scope({
      foo: { obj: { arr: ['a', 2] } }
    })
    const output = new Output({ value: 'foo' } as OutputToken, false)
    const html = await output.render(scope)
    return expect(html).to.equal('[object Object]')
  })
  it('should skip function property', async function () {
    const scope = new Scope({ obj: { foo: 'foo', bar: (x: any) => x } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const html = await output.render(scope)
    return expect(html).to.equal('[object Object]')
  })
  it('should respect to .toString()', async () => {
    const scope = new Scope({ obj: { toString: () => 'FOO' } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const str = await output.render(scope)
    return expect(str).to.equal('FOO')
  })
  it('should respect to .to_s()', async () => {
    const scope = new Scope({ obj: { to_s: () => 'FOO' } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const str = await output.render(scope)
    return expect(str).to.equal('FOO')
  })
  it('should respect to .toString()', async () => {
    const scope = new Scope({ obj: { toString: () => 'FOO' } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const str = await output.render(scope)
    return expect(str).to.equal('FOO')
  })
})
