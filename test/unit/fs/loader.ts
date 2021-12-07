import { expect, use } from 'chai'
import * as fs from '../../../src/fs/node'
import * as chaiAsPromised from 'chai-as-promised'
import { Loader } from '../../../src/fs/loader'

use(chaiAsPromised)

describe('fs/loader', function () {
  describe('.candidates()', function () {
    it('should resolve relatively', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('./foo/bar', ['/root', '/root/foo'], '/root/current', true)]
      expect(candidates).to.contain('/root/foo/bar')
    })
    it('should not include out of root candidates', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('../foo/bar', ['/root'], '/root/current', true)]
      expect(candidates).to.have.lengthOf(0)
    })
    it('should treat root as a terminated path', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('../root-dir/bar', ['/root'], '/root/current', true)]
      expect(candidates).to.have.lengthOf(0)
    })
    it('should default `.contains()` to () => true', async function () {
      const customFs = {
        ...fs,
        contains: undefined
      }
      const loader = new Loader({ relativeReference: true, fs: customFs, extname: '' } as any)
      const candidates = [...loader.candidates('../foo/bar', ['/root'], '/root/current', true)]
      expect(candidates).to.contain('/foo/bar')
    })
  })
})
