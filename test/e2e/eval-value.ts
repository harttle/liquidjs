import { expect } from 'chai'
import { Context, Liquid } from '../..'

describe('#evalValue()', function () {
  var engine: Liquid
  beforeEach(() => { engine = new Liquid({ globals: { foo: 'FOO' } }) })

  it('should support boolean', async function () {
    const val = await engine.evalValue('true')
    expect(val).to.equal(true)
  })

  it('should support binary expression with Context', async function () {
    const val = await engine.evalValue('a > b', { a: 1, b: 2 })
    expect(val).to.equal(false)
  })

  it('should inherit Liquid options', async function () {
    const val = await engine.evalValue('foo')
    expect(val).to.equal('FOO')
  })

  it('should support passing Context', async function () {
    const val = await engine.evalValue('a > b', new Context({ a: 1, b: 2 }))
    expect(val).to.equal(false)
  })

  it('should respect options in passed in Context', async function () {
    const val = await engine.evalValue('foo', new Context({}, { globals: { foo: 'BAR' } } as any))
    expect(val).to.equal('BAR')
  })
})
