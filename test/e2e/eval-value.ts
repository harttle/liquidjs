import { expect } from 'chai'
import { Liquid } from '../..'

describe('#evalValue()', function () {
  var engine: Liquid
  beforeEach(() => { engine = new Liquid() })

  it('should eval value', async function () {
    const val = await engine.evalValue('true', { opts: {} } as any)
    expect(val).to.equal(true)
  })
})
