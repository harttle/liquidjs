import * as chai from 'chai'
import Context from '../../../src/context/context'
import Output from '../../../src/template/output'
import OutputToken from '../../../src/parser/output-token'
import { Filter } from '../../../src/template/filter/filter'

const expect = chai.expect

describe('Output', function () {
  beforeEach(function () {
    Filter.clear()
  })

  it('should stringify objects', async function () {
    const scope = new Context({
      foo: { obj: { arr: ['a', 2] } }
    })
    const output = new Output({ value: 'foo' } as OutputToken, false)
    const html = await output.render(scope)
    return expect(html).to.equal('[object Object]')
  })
  it('should skip function property', async function () {
    const scope = new Context({ obj: { foo: 'foo', bar: (x: any) => x } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const html = await output.render(scope)
    return expect(html).to.equal('[object Object]')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const str = await output.render(scope)
    return expect(str).to.equal('FOO')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output({ value: 'obj' } as OutputToken, false)
    const str = await output.render(scope)
    return expect(str).to.equal('FOO')
  })
})
