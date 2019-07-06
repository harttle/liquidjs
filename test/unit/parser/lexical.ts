import * as chai from 'chai'
import { isRange } from '../../../src/parser/lexical'

const expect = chai.expect

describe('lexical', function () {
  it('should test range literal', function () {
    expect(isRange('(12..32)')).to.equal(true)
    expect(isRange('(12..foo)')).to.equal(true)
    expect(isRange('(foo.bar..foo)')).to.equal(true)
  })
})
