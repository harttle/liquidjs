import * as chai from 'chai'
import { toThenable } from '../../../src/util/async'
import { Context } from '../../../src/context/context'
import { Output } from '../../../src/template/output'
import { OutputToken } from '../../../src/tokens/output-token'
import { FilterMap } from '../../../src/template/filter/filter-map'

const expect = chai.expect

describe('Output', function () {
  const emitter: any = { write: (html: string) => (emitter.html += html), html: '' }
  let filters: FilterMap
  beforeEach(function () {
    filters = new FilterMap(false)
    emitter.html = ''
  })

  it('should stringify objects', async function () {
    const scope = new Context({
      foo: { obj: { arr: ['a', 2] } }
    })
    const output = new Output({ content: 'foo' } as OutputToken, filters)
    await toThenable(output.render(scope, emitter))
    return expect(emitter.html).to.equal('[object Object]')
  })
  it('should skip function property', async function () {
    const scope = new Context({ obj: { foo: 'foo', bar: (x: any) => x } })
    const output = new Output({ content: 'obj' } as OutputToken, filters)
    await toThenable(output.render(scope, emitter))
    return expect(emitter.html).to.equal('[object Object]')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output({ content: 'obj' } as OutputToken, filters)
    await toThenable(output.render(scope, emitter))
    return expect(emitter.html).to.equal('FOO')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output({ content: 'obj' } as OutputToken, filters)
    await toThenable(output.render(scope, emitter))
    return expect(emitter.html).to.equal('FOO')
  })
})
