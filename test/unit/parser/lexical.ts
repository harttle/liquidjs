import * as chai from 'chai'

const expect = chai.expect
const lexical = require('../../../src/parser/lexical')

describe('lexical', function () {
  it('should test range literal', function () {
    expect(lexical.isRange('(12..32)')).to.equal(true)
    expect(lexical.isRange('(12..foo)')).to.equal(true)
    expect(lexical.isRange('(foo.bar..foo)')).to.equal(true)
  })
})
