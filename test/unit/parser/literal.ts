import { expect } from 'chai'
import { parseLiteral } from '../../../src/parser/literal'
import { NullDrop } from '../../../src/drop/null-drop'

describe('parseLiteral', function () {
  it('should eval boolean literal', async function () {
    expect(parseLiteral('true')).to.equal(true)
    expect(parseLiteral('TrUE')).to.equal(undefined)
    expect(parseLiteral('false')).to.equal(false)
  })
  it('should eval number literal', async function () {
    expect(parseLiteral('2.3')).to.equal(2.3)
    expect(parseLiteral('.32')).to.equal(0.32)
    expect(parseLiteral('-23.')).to.equal(-23)
    expect(parseLiteral('23')).to.equal(23)
  })
  it('should eval string literal', async function () {
    expect(parseLiteral('"ab\'c"')).to.equal("ab'c")
    expect(parseLiteral("'ab\"c'")).to.equal('ab"c')
  })
  it('should eval nil literal', async function () {
    expect(parseLiteral('nil')).to.be.instanceOf(NullDrop)
  })
  it('should eval null literal', async function () {
    expect(parseLiteral('null')).to.be.instanceOf(NullDrop)
  })
})
