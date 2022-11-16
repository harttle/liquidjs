import { expect } from 'chai'
import { Liquid } from '../..'

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
})
