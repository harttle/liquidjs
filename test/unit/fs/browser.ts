import fs from '../../../src/fs/browser'
import * as sinon from 'sinon'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('fs/browser', function () {
  describe('#resolve()', function () {
    if (+(process.version.match(/^v(\d+)/) as RegExpMatchArray)[1] < 8) {
      console.info('jsdom not supported, skipping template-browser...')
      return
    }
    const JSDOM = require('jsdom').JSDOM
    beforeEach(function () {
      const dom = new JSDOM(``, {
        url: 'https://example.com/foo/bar/',
        contentType: 'text/html',
        includeNodeLocations: true
      });
      (global as any).document = dom.window.document
    })
    afterEach(function () {
      delete (global as any).document
    })
    it('should support relative root', function () {
      expect(fs.resolve('./views/', 'foo', '')).to.equal('https://example.com/foo/bar/views/foo')
    })
    it('should treat root as directory', function () {
      expect(fs.resolve('./views', 'foo', '')).to.equal('https://example.com/foo/bar/views/foo')
    })
    it('should support absolute root', function () {
      expect(fs.resolve('/views', 'foo', '')).to.equal('https://example.com/views/foo')
    })
    it('should support empty root', function () {
      expect(fs.resolve('', 'page.html', '')).to.equal('https://example.com/foo/bar/page.html')
    })
    it('should support full url as root', function () {
      expect(fs.resolve('https://example.com/views/', 'page.html', '')).to.equal('https://example.com/views/page.html')
    })
    it('should add extname when absent', function () {
      expect(fs.resolve('https://example.com/views/', 'page', '.html')).to.equal('https://example.com/views/page.html')
    })
    it('should add extname for urls have searchParams', function () {
      expect(fs.resolve('https://example.com/views/', 'page?foo=bar', '.html')).to.equal('https://example.com/views/page.html?foo=bar')
    })
    it('should not add extname when full url is given', function () {
      expect(fs.resolve('https://example.com/views/', 'https://google.com/page.php', '.html')).to.equal('https://google.com/page.php')
    })
    it('should not add extname when already have one', function () {
      expect(fs.resolve('https://example.com/views/', 'page.php', '.html')).to.equal('https://example.com/views/page.php')
    })
  })

  describe('#exists()', () => {
    it('should always return true', async function () {
      const val = await fs.exists('/foo/bar')
      expect(val).to.equal(true)
    })
  })

  describe('#readFile()', () => {
    let server: sinon.SinonFakeServer
    beforeEach(() => {
      server = sinon.fakeServer.create()
      server.autoRespond = true
      server.respondWith('GET', 'https://example.com/views/hello.html',
        [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}']);
      (global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest()
    })
    afterEach(() => {
      server.restore()
      delete (global as any).XMLHttpRequest
    })
    it('should get corresponding text', async function () {
      const html = await fs.readFile('https://example.com/views/hello.html')
      return expect(html).to.equal('hello {{name}}')
    })
    it('should throw 404', () => {
      return expect(fs.readFile('https://example.com/not/exist.html'))
        .to.be.rejectedWith('Not Found')
    })
    it('should throw error', function () {
      const result = expect(fs.readFile('https://example.com/views/hello.html'))
        .to.be.rejectedWith('An error occurred whilst receiving the response.')
      server.requests[0].error()
      return result
    })
  })
})
