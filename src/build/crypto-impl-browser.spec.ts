import { webcrypto } from 'crypto'
import * as cryptoImpl from './crypto-impl-browser'

describe('crypto-impl/browser', function () {
  beforeEach(function () {
    Object.defineProperty(global, 'crypto', {
      value: webcrypto,
      writable: true,
      configurable: true
    })
  })

  afterEach(function () {
    delete (global as any).crypto
  })

  describe('#sha256()', function () {
    it('should hash the Shopify reference example', async function () {
      expect(await cryptoImpl.sha256('Polyjuice'))
        .toBe('44ac1d7a2936e30a5de07082fd65d6fe9b1fb658a1a98bfe65bc5959beac5dd0')
    })

    it('should hash an empty string', async function () {
      expect(await cryptoImpl.sha256(''))
        .toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    })

    it('should hash unicode characters', async function () {
      expect(await cryptoImpl.sha256('你好世界'))
        .toBe('beca6335b20ff57ccc47403ef4d9e0b8fccb4442b3151c2e7d50050673d43172')
    })
  })

  describe('#hmacSha256()', function () {
    it('should hash the Shopify reference example', async function () {
      expect(await cryptoImpl.hmacSha256('Polyjuice', 'Polina'))
        .toBe('8e0d5d65cff1242a4af66c8f4a32854fd5fb80edcc8aabe9b302b29c7c71dc20')
    })

    it('should hash an empty message with a key', async function () {
      expect(await cryptoImpl.hmacSha256('', 'key'))
        .toBe('5d5d139563c95b5967b9bd9a8c9b233a9dedb45072794cd232dc1b74832607d0')
    })
  })
})
