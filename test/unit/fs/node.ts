import fs from 'src/fs/node'
import * as path from 'path'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { mock, restore } from 'test/stub/mockfs'

use(chaiAsPromised)

describe('fs', function () {
  before(() => mock({
    '/foo/bar.html': 'bar',
    '/un-readable.html': { mode: '0000', content: '' }
  }))
  after(restore)

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
      const result = await fs.exists('/foo/foo.html')
      return expect(result).to.be.false
    })
    it('should resolve as true if exists', async () => {
      const result = await fs.exists('/foo/bar.html')
      return expect(result).to.be.true
    })
  })
  describe('#readFile', function () {
    it('should throw when not exist', function () {
      return expect(fs.readFile('/foo/foo.html')).to.rejectedWith('ENOENT')
    })
    it('should throw when file not readable', function () {
      return expect(fs.readFile('/un-readable.html')).to
        .be.rejectedWith(/EACCES/)
    })
  })
})
