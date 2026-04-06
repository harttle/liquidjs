import * as fs from './fs-impl'
import { resolve } from 'path'
import { Loader, LookupType } from './loader'
import { toValueSync } from '../util/async'

describe('fs/loader', function () {
  describe('.candidates()', function () {
    it('should resolve relatively', function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('./foo/bar', ['/root', '/root/foo'], '/root/current')]
      expect(candidates).toContain(resolve('/root/foo/bar'))
    })
  })
  describe('.lookup()', function () {
    it('should not include out of root candidates', function () {
      const mockFs = { ...fs, existsSync: () => true, exists: async () => true }
      const loader = new Loader({ relativeReference: true, fs: mockFs, extname: '', partials: ['/root'] } as any)
      expect(() => toValueSync(loader.lookup('../foo/bar', LookupType.Partials, true, '/root/current')))
        .toThrow(/ENOENT/)
    })
    it('should treat root as a terminated path', function () {
      const mockFs = { ...fs, existsSync: () => true, exists: async () => true }
      const loader = new Loader({ relativeReference: true, fs: mockFs, extname: '', partials: ['/root'] } as any)
      expect(() => toValueSync(loader.lookup('../root-dir/bar', LookupType.Partials, true, '/root/current')))
        .toThrow(/ENOENT/)
    })
    it('should use permissive contains when fs.contains is omitted', function () {
      const mockFs = { ...fs, existsSync: () => true, exists: async () => true, contains: undefined, containsSync: undefined }
      const loader = new Loader({ relativeReference: true, fs: mockFs, extname: '', partials: ['/root'] } as any)
      const result = toValueSync(loader.lookup('./foo/bar', LookupType.Partials, true, '/root/current'))
      expect(result).toBe(resolve('/root/foo/bar'))
    })
  })
})
