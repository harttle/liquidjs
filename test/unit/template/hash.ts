import * as chai from 'chai'
import { toThenable } from '../../../src/util/async'
import { Hash } from '../../../src/template/tag/hash'
import { Context } from '../../../src/context/context'

const expect = chai.expect

describe('Hash', function () {
  it('should parse variable', async function () {
    const hash = await toThenable(Hash.create('num:foo', new Context({ foo: 3 })))
    expect(hash.num).to.equal(3)
  })
  it('should parse literals', async function () {
    const hash = await toThenable(Hash.create('num:3', new Context()))
    expect(hash.num).to.equal(3)
  })
})
