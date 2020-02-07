import { expect } from 'chai'
import { parseLiteral, parseStringLiteral } from '../../../src/parser/literal'
import { NullDrop } from '../../../src/drop/null-drop'

describe('parseLiteral()', function () {
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

describe('parseStringLiteral()', function () {
  it('should parse octal escape', () => {
    expect(parseStringLiteral(String.raw`"\1010"`)).to.equal('A0')
    expect(parseStringLiteral(String.raw`"\12"`)).to.equal('\n')
    expect(parseStringLiteral(String.raw`"\01"`)).to.equal('\u0001')
    expect(parseStringLiteral(String.raw`"\0"`)).to.equal('\0')
  })
  it('should skip invalid octal escape', () => {
    expect(parseStringLiteral(String.raw`"\9"`)).to.equal('9')
  })
  it('should parse \n, \t, \r', () => {
    expect(parseStringLiteral(String.raw`"fo\no"`)).to.equal('fo\no')
    expect(parseStringLiteral(String.raw`'fo\to'`)).to.equal('fo\to')
    expect(parseStringLiteral(String.raw`'fo\ro'`)).to.equal('fo\ro')
  })
  it('should parse unicode(hex) escape', () => {
    expect(parseStringLiteral('"\\u003C"')).to.equal('<')
    expect(parseStringLiteral('"\\u003cZ"')).to.equal('<Z')
    expect(parseStringLiteral('"\\u41"')).to.equal('A')
  })
  it('should skip invalid unicode(hex) escape', () => {
    expect(parseStringLiteral('"\\u41Z"')).to.equal('AZ')
    expect(parseStringLiteral('"\\uZ"')).to.equal('\0Z')
  })
  it('should parse quote escape', () => {
    expect(parseStringLiteral(String.raw`"fo\'o"`)).to.equal("fo'o")
    expect(parseStringLiteral(String.raw`'fo\"o'`)).to.equal('fo"o')
  })
  it('should parse slash escape', () => {
    expect(parseStringLiteral(String.raw`'fo\\o'`)).to.equal('fo\\o')
  })
})