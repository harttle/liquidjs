import { parseStringLiteral } from './string'

describe('parseStringLiteral()', function () {
  it('should parse octal escape', () => {
    expect(parseStringLiteral(String.raw`"\1010"`)).toBe('A0')
    expect(parseStringLiteral(String.raw`"\12"`)).toBe('\n')
    expect(parseStringLiteral(String.raw`"\01"`)).toBe('\u0001')
    expect(parseStringLiteral(String.raw`"\0"`)).toBe('\0')
  })
  it('should skip invalid octal escape', () => {
    expect(parseStringLiteral(String.raw`"\9"`)).toBe('9')
  })
  it('should parse \\n, \\t, \\r', () => {
    expect(parseStringLiteral(String.raw`"fo\no"`)).toBe('fo\no')
    expect(parseStringLiteral(String.raw`'fo\to'`)).toBe('fo\to')
    expect(parseStringLiteral(String.raw`'fo\ro'`)).toBe('fo\ro')
  })
  it('should parse unicode(hex) escape', () => {
    expect(parseStringLiteral('"\\u003C"')).toBe('<')
    expect(parseStringLiteral('"\\u003cZ"')).toBe('<Z')
    expect(parseStringLiteral('"\\u41"')).toBe('A')
  })
  it('should skip invalid unicode(hex) escape', () => {
    expect(parseStringLiteral('"\\u41Z"')).toBe('AZ')
    expect(parseStringLiteral('"\\uZ"')).toBe('\0Z')
  })
  it('should parse quote escape', () => {
    expect(parseStringLiteral(String.raw`"fo\'o"`)).toBe("fo'o")
    expect(parseStringLiteral(String.raw`'fo\"o'`)).toBe('fo"o')
  })
  it('should parse slash escape', () => {
    expect(parseStringLiteral(String.raw`'fo\\o'`)).toBe('fo\\o')
  })
})
