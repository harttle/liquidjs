import { MapFS } from './map-fs'

describe('MapFS', () => {
  const fs = new MapFS({})
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
})
