import { normalize } from '../../../src/liquid-options'

describe('LiquidOptions#root', function () {
  describe('#normalize()', function () {
    it('should normalize string typed root array', function () {
      const options = normalize({ root: 'foo' })
      expect(options.root).toEqual(['foo'])
    })
    it('should normalize null typed root as empty array', function () {
      const options = normalize({ root: null } as any)
      expect(options.root).toEqual([])
    })
  })
})
