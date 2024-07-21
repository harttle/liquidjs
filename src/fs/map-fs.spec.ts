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
  })
  describe('#.readFileSync()', () => {
    it('should throw if not exist', () => {
      expect(() => fs.readFileSync('foo/bar')).toThrow('NOENT: foo/bar')
    })
  })
})
