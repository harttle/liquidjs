import * as sinon from 'sinon'
import { JSDOM } from 'jsdom'
import type { Liquid } from '../../src/liquid'
const LiquidUMD = require('../../dist/liquid.browser.umd.js').Liquid

describe('xhr', () => {
  if (+(process.version.match(/^v(\d+)/) as RegExpMatchArray)[1] < 8) {
    console.info('jsdom not supported, skipping xhr...')
    return
  }
  let server: sinon.SinonFakeServer, engine: Liquid
  beforeEach(() => {
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondWith('GET', 'https://example.com/views/hello.html',
      [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
    let dom = new JSDOM('', {
      url: 'https://example.com/foo/bar.html',
      contentType: 'text/html',
      includeNodeLocations: true
    });
    (global as any).XMLHttpRequest = sinon.FakeXMLHttpRequest;
    (global as any).document = dom.window.document
    engine = new LiquidUMD({
      root: 'https://example.com/views/',
      extname: '.html'
    })
  })
  afterEach(() => {
    server.restore()
    delete (global as any).XMLHttpRequest
    delete (global as any).document
  })
  describe('#renderFile()', () => {
    it('should support without extname', async () => {
      const html = await engine.renderFile('hello', { name: 'alice1' })
      return expect(html).toBe('hello alice1')
    })
    it('should support with extname', async () => {
      const html = await engine.renderFile('hello.html', { name: 'alice2' })
      return expect(html).toBe('hello alice2')
    })
    it('should support with absolute path', async () => {
      server.respondWith('GET', 'https://example.com/foo.html',
        [200, { 'Content-Type': 'text/plain' }, 'foo'])
      const html = await engine.renderFile('/foo.html')
      return expect(html).toBe('foo')
    })
    it('should support with url', async () => {
      const html = await engine.renderFile('https://example.com/views/hello.html', { name: 'alice4' })
      return expect(html).toBe('hello alice4')
    })
    it('should support include', async () => {
      server.respondWith('GET', 'https://example.com/views/hello.html',
        [200, { 'Content-Type': 'text/plain' }, "hello {% include 'name.html' %}"])
      server.respondWith('GET', 'https://example.com/views/name.html',
        [200, { 'Content-Type': 'text/plain' }, '{{name}}'])
      const html = await engine.renderFile('hello.html', { name: 'alice5' })
      return expect(html).toBe('hello alice5')
    })
    it('should throw 404', () => {
      return expect(engine.renderFile('/not/exist.html'))
        .rejects.toThrow('Not Found')
    })
    it('should throw error', function () {
      const result = expect(engine.renderFile('hello.html'))
        .rejects.toThrow('An error occurred whilst receiving the response.');
      (global as any).XMLHttpRequest.onCreate = function (request: sinon.SinonFakeXMLHttpRequest) {
        setTimeout(() => request.error())
      }
      return result
    })
  })
  describe('#renderFile() with root specified', () => {
    it('should support undefined root', async () => {
      engine = new LiquidUMD({
        extname: '.html'
      })
      server.respondWith('GET', 'https://example.com/foo/hello.html',
        [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
      const html = await engine.renderFile('hello.html', { name: 'alice5' })
      return expect(html).toBe('hello alice5')
    })
    it('should support empty root', async () => {
      engine = new LiquidUMD({
        root: '',
        extname: '.html'
      })
      server.respondWith('https://example.com/foo/hello.html',
        [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
      const html = await engine.renderFile('hello.html', { name: 'alice5' })
      return expect(html).toBe('hello alice5')
    })
    it('should support with relative path', async () => {
      engine = new LiquidUMD({
        root: './views/',
        extname: '.html'
      })
      server.respondWith('GET', 'https://example.com/foo/views/hello.html',
        [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
      const html = await engine.renderFile('hello.html', { name: 'alice5' })
      return expect(html).toBe('hello alice5')
    })
    it('should support with absolute path', async () => {
      engine = new LiquidUMD({
        root: '/views/',
        extname: '.html'
      })
      server.respondWith('GET', 'https://example.com/views/hello.html',
        [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
      const html = await engine.renderFile('hello.html', { name: 'alice5' })
      return expect(html).toBe('hello alice5')
    })
    it('should support with url', async () => {
      engine = new LiquidUMD({
        root: 'http://foo.com/bar/',
        extname: '.html'
      })
      server.respondWith('GET', 'http://foo.com/bar/hello.html',
        [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
      const html = await engine.renderFile('hello.html', { name: 'alice5' })
      return expect(html).toBe('hello alice5')
    })
  })
  describe('cache options', () => {
    it('should be disabled by default', () => {
      server.respondWith('GET', 'https://example.com/views/foo.html',
        [200, { 'Content-Type': 'text/plain' }, 'foo1'])
      return engine.renderFile('foo.html')
        .then((html: string) => {
          expect(html).toBe('foo1')
          server.respondWith('GET', 'https://example.com/views/foo.html',
            [200, { 'Content-Type': 'text/plain' }, 'foo2'])
          return engine.renderFile('foo.html')
        })
        .then((html: string) => expect(html).toBe('foo2'))
    })
    it('should respect cache=true option', () => {
      engine = new LiquidUMD({
        root: '/views/',
        extname: '.html',
        cache: true
      })
      server.respondWith('GET', 'https://example.com/views/foo.html',
        [200, { 'Content-Type': 'text/plain' }, 'foo1'])
      return engine.renderFile('foo.html')
        .then((html: string) => {
          expect(html).toBe('foo1')
          server.respondWith('GET', 'https://example.com/views/foo.html',
            [200, { 'Content-Type': 'text/plain' }, 'foo2'])
          return engine.renderFile('foo.html')
        })
        .then((html: string) => expect(html).toBe('foo1'))
    })
  })
})
