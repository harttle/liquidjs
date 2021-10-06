import * as fs from '../../../src/fs/node'
import * as path from 'path'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('fs/node', function () {
  describe('.resolve()', function () {
    it('should resolve based on root', async function () {
      const filepath = fs.resolve('/foo', 'bar.html', '.liquid')
      const expected = path.resolve('/foo/bar.html')
      return expect(filepath).to.equal(expected)
    })
    it('should add extension if it has no extension', async function () {
      const filepath = fs.resolve('/foo', 'bar', '.liquid')
      const expected = path.resolve('/foo/bar.liquid')
      return expect(filepath).to.equal(expected)
    })
  })
  describe('.existsSync', () => {
    it('should resolve as false if not exists', () => {
      expect(fs.existsSync('/foo/bar')).to.be.false
    })
    it('should resolve as true if exists', () => {
      expect(fs.existsSync(__filename)).to.be.true
    })
  })
  describe('.exists', () => {
    it('should resolve as false if not exists', async () => {
      const result = await fs.exists('/foo/bar')
      expect(result).to.be.false
    })
    it('should resolve as true if exists', async () => {
      const result = await fs.exists(__filename)
      expect(result).to.be.true
    })
  })
  describe('.readFileSync', function () {
    it('should throw when not exist', function () {
      return expect(() => fs.readFileSync('/foo/bar')).to.throw('ENOENT')
    })
    it('should read content if exists', function () {
      const content = fs.readFileSync(__filename)
      expect(content).to.contain('should read content if exists')
    })
  })
  describe('.readFile', function () {
    it('should throw when not exist', function () {
      return expect(fs.readFile('/foo/bar')).to.rejectedWith('ENOENT')
    })
    it('should read content if exists', async function () {
      const content = await fs.readFile(__filename)
      expect(content).to.contain('should read content if exists')
    })
  })
})
