import * as fs from './fs-impl'
import * as path from 'path'

describe('fs-impl', function () {
  describe('.resolve()', function () {
    it('should resolve based on root', async function () {
      const filepath = fs.resolve('/foo', 'bar.html', '.liquid')
      const expected = path.resolve('/foo/bar.html')
      return expect(filepath).toBe(expected)
    })
    it('should add extension if it has no extension', async function () {
      const filepath = fs.resolve('/foo', 'bar', '.liquid')
      const expected = path.resolve('/foo/bar.liquid')
      return expect(filepath).toBe(expected)
    })
  })
  describe('.existsSync', () => {
    it('should resolve as false if not exists', () => {
      expect(fs.existsSync('/foo/bar')).toBeFalsy()
    })
    it('should resolve as true if exists', () => {
      expect(fs.existsSync(__filename)).toBeTruthy()
    })
  })
  describe('.exists', () => {
    it('should resolve as false if not exists', async () => {
      const result = await fs.exists('/foo/bar')
      expect(result).toBeFalsy()
    })
    it('should resolve as true if exists', async () => {
      const result = await fs.exists(__filename)
      expect(result).toBeTruthy()
    })
  })
  describe('.readFileSync', function () {
    it('should throw when not exist', function () {
      return expect(() => fs.readFileSync('/foo/bar')).toThrow('ENOENT')
    })
    it('should read content if exists', function () {
      const content = fs.readFileSync(__filename)
      expect(content).toContain('should read content if exists')
    })
  })
  describe('.readFile', function () {
    it('should throw when not exist', function () {
      return expect(fs.readFile('/foo/bar')).rejects.toHaveProperty('message', expect.stringMatching('ENOENT'))
    })
    it('should read content if exists', async function () {
      const content = await fs.readFile(__filename)
      expect(content).toContain('should read content if exists')
    })
  })
})
