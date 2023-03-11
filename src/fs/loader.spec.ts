import * as fs from './fs-impl'
import { Loader } from './loader'

describe('fs/loader', function () {
  describe('.candidates()', function () {
    it('should resolve relatively', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('./foo/bar', ['/root', '/root/foo'], '/root/current', true)]
      expect(candidates).toContain('/root/foo/bar')
    })
    it('should not include out of root candidates', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('../foo/bar', ['/root'], '/root/current', true)]
      expect(candidates).toHaveLength(0)
    })
    it('should treat root as a terminated path', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('../root-dir/bar', ['/root'], '/root/current', true)]
      expect(candidates).toHaveLength(0)
    })
    it('should default `.contains()` to () => true', async function () {
      const customFs = {
        ...fs,
        contains: undefined
      }
      const loader = new Loader({ relativeReference: true, fs: customFs, extname: '' } as any)
      const candidates = [...loader.candidates('../foo/bar', ['/root'], '/root/current', true)]
      expect(candidates).toContain('/foo/bar')
    })
  })
})
