import { test } from '../../../stub/render'

describe('filters/object', function () {
  describe('default', function () {
    it('should use default when falsy', () => test('{{false |default: "a"}}', 'a'))
    it('should not use default when truthy', () => test('{{true |default: "a"}}', 'true'))
  })
})
