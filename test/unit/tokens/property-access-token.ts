import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { PropertyAccessToken } from '../../../src/tokens/property-access-token'
import { QuotedToken } from '../../../src/tokens/quoted-token'
import { WordToken } from '../../../src/tokens/word-token'

chai.use(sinonChai)
const expect = chai.expect

describe('PropertyAccessToken', function () {
  describe('getVariableAsText', function () {
    it('should return correct value for WordToken', function () {
      const token = new PropertyAccessToken(new WordToken('foo', 0, 3), [], 3)
      expect(token.getVariableAsText()).to.equal('foo')
    })
    it('should return correct value for QuotedToken', function () {
      const token = new PropertyAccessToken(new QuotedToken('"foo bar"', 0, 9), [], 9)
      expect(token.getVariableAsText()).to.equal('foo bar')
    })
  })
})
