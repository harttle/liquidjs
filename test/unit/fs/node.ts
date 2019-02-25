import fs from '../../../src/fs/node'
import * as path from 'path'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('fs', function () {
  describe('#resolve()', function () {
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
  describe('#exists', () => {
    it('should resolve as false if not exists', async () => {
      const result = await fs.exists('/foo/bar')
      return expect(result).to.be.false
    })
    it('should resolve as true if exists', async () => {
      const result = await fs.exists(__filename)
      return expect(result).to.be.true
    })
  })
  describe('#readFile', function () {
    it('should throw when not exist', function () {
      return expect(fs.readFile('/foo/bar')).to.rejectedWith('ENOENT')
    })
    it('should read content if exists', async function () {
      const content = await fs.readFile(__filename)
      return expect(content).to.contain('should read content if exists')
    })
  })
})
