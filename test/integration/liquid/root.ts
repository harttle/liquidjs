import { normalize } from '../../../src/liquid-options'
import { expect } from 'chai'
import { resolve } from 'path'

describe('LiquidOptions#root', function () {
  describe('#normalize ()', function () {
    it('should normalize string typed root array', function () {
      const options = normalize({ root: 'foo' })
      expect(options.root).to.eql([resolve('foo') + '/'])
    })
    it('should normalize null typed root as empty array', function () {
      const options = normalize({ root: null } as any)
      expect(options.root).to.eql([])
    })
  })
})
