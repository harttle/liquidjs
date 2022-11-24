import * as chai from 'chai'
import { toPromise } from '../../../src/util/async'
import { Hash } from '../../../src/template/hash'
import { Context } from '../../../src/context/context'

const expect = chai.expect

describe('Hash', function () {
  it('should parse "reverse"', async function () {
    const hash = await toPromise(new Hash('reverse').render(new Context({ foo: 3 })))
    expect(hash).to.haveOwnProperty('reverse')
    expect(hash.reverse).to.be.true
  })
  it('should parse "num:foo"', async function () {
    const hash = await toPromise(new Hash('num:foo').render(new Context({ foo: 3 })))
    expect(hash.num).to.equal(3)
  })
  it('should parse "num:3"', async function () {
    const hash = await toPromise(new Hash('num:3').render(new Context()))
    expect(hash.num).to.equal(3)
  })
  it('should parse "num: arr[0]"', async function () {
    const hash = await toPromise(new Hash('num:3').render(new Context({ arr: [3] })))
    expect(hash.num).to.equal(3)
  })
  it('should parse "num: 2.3"', async function () {
    const hash = await toPromise(new Hash('num:2.3').render(new Context()))
    expect(hash.num).to.equal(2.3)
  })
  it('should parse "num:bar.coo"', async function () {
    const pending = new Hash('num:bar.coo').render(new Context({ bar: { coo: 3 } }))
    const hash = await toPromise(pending)
    expect(hash.num).to.equal(3)
  })
  it('should parse "num1:2.3 reverse,num2:bar.coo\n num3: arr[0]"', async function () {
    const ctx = new Context({ bar: { coo: 3 }, arr: [4] })
    const hash = await toPromise(new Hash('num1:2.3 reverse,num2:bar.coo\n num3: arr[0]').render(ctx))
    expect(hash).to.deep.equal({
      num1: 2.3,
      reverse: true,
      num2: 3,
      num3: 4
    })
  })
})
