import { QuotedToken, PropertyAccessToken, IdentifierToken } from '.'

describe('PropertyAccessToken', function () {
  describe('#propertyName', function () {
    it('should return correct value for IdentifierToken', function () {
      const token = new PropertyAccessToken(new IdentifierToken('foo', 0, 3), [], 3)
      expect(token.propertyName).toBe('foo')
    })
    it('should return correct value for QuotedToken', function () {
      const token = new PropertyAccessToken(new QuotedToken('"foo bar"', 0, 9), [], 9)
      expect(token.propertyName).toBe('foo bar')
    })
  })
})
