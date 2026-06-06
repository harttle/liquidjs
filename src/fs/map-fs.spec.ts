import { MapFS } from './map-fs'

describe('MapFS', () => {
  const fs = new MapFS({})
  describe('#resolve()', () => {
    it('should resolve relative file paths', () => {
      expect(fs.resolve('foo/bar', 'coo', '')).toEqual('foo/bar/coo')
    })
    it('should resolve to parent', () => {
      expect(fs.resolve('foo/bar', '../coo', '')).toEqual('foo/coo')
    })
    it('should resolve to root', () => {
      expect(fs.resolve('foo/bar', '../../coo', '')).toEqual('coo')
    })
    it('should resolve exceeding root', () => {
      expect(fs.resolve('foo/bar', '../../../coo', '')).toEqual('coo')
    })
    it('should resolve from absolute path', () => {
      expect(fs.resolve('/foo/bar', '../../coo', '')).toEqual('/coo')
    })
    it('should resolve exceeding root from absolute path', () => {
      expect(fs.resolve('/foo/bar', '../../../coo', '')).toEqual('/coo')
    })
    it('should resolve from invalid path', () => {
      expect(fs.resolve('foo//bar', '../coo', '')).toEqual('foo/coo')
    })
    it('should resolve current path', () => {
      expect(fs.resolve('foo/bar', '.././coo', '')).toEqual('foo/coo')
    })
    it('should resolve invalid path', () => {
      expect(fs.resolve('foo/bar', '..//coo', '')).toEqual('foo/coo')
    })
    it('should resolve from a trailing separator', () => {
      expect(fs.resolve('/foo/bar/', 'coo', '')).toEqual('/foo/bar/coo')
    })
  })
  describe('#containsSync()', () => {
    it('should contain files under root', () => {
      expect(fs.containsSync('foo/bar', 'foo/bar/coo')).toBe(true)
    })
    it('should contain root itself', () => {
      expect(fs.containsSync('foo/bar', 'foo/bar')).toBe(true)
    })
    it('should contain root itself with a trailing separator', () => {
      expect(fs.containsSync('foo/bar/', 'foo/bar')).toBe(true)
    })
    it('should treat root as a terminated path', () => {
      expect(fs.containsSync('foo/bar', 'foo/bar-baz/coo')).toBe(false)
    })
    it('should allow all files from default root', () => {
      expect(fs.containsSync('.', 'foo/bar')).toBe(true)
    })
  })
  describe('#.readFileSync()', () => {
    it('should throw if not exist', () => {
      expect(() => fs.readFileSync('foo/bar')).toThrow('NOENT: foo/bar')
    })
  })
})
