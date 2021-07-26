import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { PropertyAccessToken } from '../../../src/tokens/property-access-token'
import { QuotedToken } from '../../../src/tokens/quoted-token'
import { IdentifierToken } from '../../../src/tokens/identifier-token'

chai.use(sinonChai)
const expect = chai.expect

describe('PropertyAccessToken', function () {
  describe('#propertyName', function () {
    it('should return correct value for IdentifierToken', function () {
      const token = new PropertyAccessToken(new IdentifierToken('foo', 0, 3), [], 3)
      expect(token.propertyName).to.equal('foo')
    })
    it('should return correct value for QuotedToken', function () {
      const token = new PropertyAccessToken(new QuotedToken('"foo bar"', 0, 9), [], 9)
      expect(token.propertyName).to.equal('foo bar')
    })
  })
})
