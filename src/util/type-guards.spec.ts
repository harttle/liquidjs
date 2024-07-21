import { LiteralToken } from '../tokens'
import { isLiteralToken, isNumberToken, isWordToken } from './type-guards'

describe('isLiteralToken()', () => {
  it('should return true for literal', () => {
    expect(isLiteralToken(new LiteralToken('true', 0, 4))).toBeTruthy()
  })
})
describe('isWordToken()', () => {
  it('should return false for literal', () => {
    expect(isWordToken(new LiteralToken('true', 0, 4))).toBeFalsy()
  })
})
describe('isNumberToken()', () => {
  it('should return false for literal', () => {
    expect(isNumberToken(new LiteralToken('true', 0, 4))).toBeFalsy()
  })
  it('should return false for null', () => {
    expect(isNumberToken(null)).toBeFalsy()
  })
})
