import { test } from '../../stub/render'

const SHA256_EMPTY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

describe('filters/crypto', function () {
  describe('sha256', function () {
    it('should hash the Shopify reference example', () => {
      return test(
        '{{ "Polyjuice" | sha256 }}',
        '44ac1d7a2936e30a5de07082fd65d6fe9b1fb658a1a98bfe65bc5959beac5dd0'
      )
    })

    it('should hash an empty string', () => {
      return test('{{ "" | sha256 }}', SHA256_EMPTY)
    })

    it('should treat undefined as empty string', () => {
      return test('{{ foo | sha256 }}', SHA256_EMPTY)
    })

    it('should treat null as empty string', () => {
      return test('{{ null | sha256 }}', SHA256_EMPTY)
    })

    it('should stringify numeric input', () => {
      return test(
        '{{ 123 | sha256 }}',
        'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'
      )
    })

    it('should stringify boolean input', () => {
      return test(
        '{{ true | sha256 }}',
        'b5bea41b6c623f7c09f1bf24dcae58ebab3c0cdd90ad966bc43a45b44867e12b'
      )
    })
  })

  describe('hmac_sha256', function () {
    it('should hash the Shopify reference example', () => {
      return test(
        "{{ 'Polyjuice' | hmac_sha256: 'Polina' }}",
        '8e0d5d65cff1242a4af66c8f4a32854fd5fb80edcc8aabe9b302b29c7c71dc20'
      )
    })

    it('should accept a numeric key (stringified)', () => {
      return test(
        "{{ 'hello' | hmac_sha256: 42 }}",
        '3bdadea6ed0e95ededc15dc4421ce7654c970156843dfd997be3fef5358168ca'
      )
    })

    it('should hash an empty message with an empty key', () => {
      return test(
        "{{ '' | hmac_sha256: '' }}",
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad'
      )
    })

    it('should treat undefined input as empty string', () => {
      return test(
        "{{ foo | hmac_sha256: '' }}",
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad'
      )
    })
  })
})
