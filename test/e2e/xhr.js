var Liquid = require('../../dist/liquid.js')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('chai-as-promised'))

describe('xhr', () => {
  if (process.version.match(/^v(\d+)/)[1] < 8) {
    console.info('jsdom not supported, skipping xhr...')
    return
  }
  var JSDOM = require('jsdom').JSDOM
  var server, engine
  beforeEach(() => {
    server = sinon.createFakeServer()
    server.autoRespond = true
    server.respondWith('GET', 'https://example.com/views/hello.html',
      [200, {'Content-Type': 'text/plain'}, 'hello {{name}}'])
    var dom = new JSDOM('', {
      url: 'https://example.com/foo/bar.html',
      contentType: 'text/html',
      includeNodeLocations: true
    })
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest()
    global.document = dom.window.document
    engine = Liquid({
      root: 'https://example.com/views/',
      extname: '.html'
    })
  })
  afterEach(() => {
    server.restore()
    delete global.XMLHttpRequest
    delete global.document
  })
  describe('#renderFile()', () => {
    it('should support without extname', () => {
      return expect(engine.renderFile('hello', {name: 'alice1'}))
        .to.eventually.equal('hello alice1')
    })
    it('should support with extname', () => {
      return expect(engine.renderFile('hello.html', {name: 'alice2'}))
        .to.eventually.equal('hello alice2')
    })
    it('should support with absolute path', () => {
      server.respondWith('GET', 'https://example.com/foo.html',
        [200, {'Content-Type': 'text/plain'}, 'foo'])
      return expect(engine.renderFile('/foo.html'))
        .to.eventually.equal('foo')
    })
    it('should support with url', () => {
      return expect(engine.renderFile('https://example.com/views/hello.html', {name: 'alice4'}))
        .to.eventually.equal('hello alice4')
    })
    it('should support include', () => {
      server.respondWith('GET', 'https://example.com/views/hello.html',
        [200, {'Content-Type': 'text/plain'}, "hello {% include 'name.html' %}"])
      server.respondWith('GET', 'https://example.com/views/name.html',
        [200, {'Content-Type': 'text/plain'}, '{{name}}'])
      return expect(engine.renderFile('hello.html', {name: 'alice5'}))
        .to.eventually.equal('hello alice5')
    })
    it('should throw 404', () => {
      return expect(engine.renderFile('/not/exist.html'))
        .to.be.rejectedWith('Not Found')
    })
    it('should throw error', function (done) {
      engine.renderFile('hello.html')
        .then(() => done('should not be resolved'))
        .catch(function (e) {
          expect(e.message).to.equal('An error occurred whilst receiving the response.')
          done()
        })
      global.XMLHttpRequest.onCreate = function (request) {
        setTimeout(() => request.error())
      }
    })
  })
  describe('#renderFile() with root specified', () => {
    it('should support undefined root', () => {
      engine = Liquid({
        extname: '.html'
      })
      server.respondWith('GET', 'https://example.com/foo/hello.html',
        [200, {'Content-Type': 'text/plain'}, 'hello {{name}}'])
      return expect(engine.renderFile('hello.html', {name: 'alice5'}))
        .to.eventually.equal('hello alice5')
    })
    it('should support empty root', () => {
      engine = Liquid({
        root: '',
        extname: '.html'
      })
      server.respondWith('https://example.com/foo/hello.html',
        [200, {'Content-Type': 'text/plain'}, 'hello {{name}}'])
      return expect(engine.renderFile('hello.html', {name: 'alice5'}))
        .to.eventually.equal('hello alice5')
    })
    it('should support with relative path', () => {
      engine = Liquid({
        root: './views/',
        extname: '.html'
      })
      server.respondWith('GET', 'https://example.com/foo/views/hello.html',
        [200, {'Content-Type': 'text/plain'}, 'hello {{name}}'])
      return expect(engine.renderFile('hello.html', {name: 'alice5'}))
        .to.eventually.equal('hello alice5')
    })
    it('should support with absolute path', () => {
      engine = Liquid({
        root: '/views/',
        extname: '.html'
      })
      server.respondWith('GET', 'https://example.com/views/hello.html',
        [200, {'Content-Type': 'text/plain'}, 'hello {{name}}'])
      return expect(engine.renderFile('hello.html', {name: 'alice5'}))
        .to.eventually.equal('hello alice5')
    })
    it('should support with url', () => {
      engine = Liquid({
        root: 'https://foo.com/bar/',
        extname: '.html'
      })
      server.respondWith('GET', 'https://foo.com/bar/hello.html',
        [200, {'Content-Type': 'text/plain'}, 'hello {{name}}'])
      return expect(engine.renderFile('hello.html', {name: 'alice5'}))
        .to.eventually.equal('hello alice5')
    })
  })
  describe('cache options', () => {
    it('should be disabled by default', () => {
      server.respondWith('GET', 'https://example.com/views/foo.html',
        [200, {'Content-Type': 'text/plain'}, 'foo1'])
      return engine.renderFile('foo.html')
        .then((html) => {
          expect(html).to.equal('foo1')
          server.respondWith('GET', 'https://example.com/views/foo.html',
            [200, {'Content-Type': 'text/plain'}, 'foo2'])
          return engine.renderFile('foo.html')
        })
        .then(html => expect(html).to.equal('foo2'))
    })
    it('should respect cache=true option', () => {
      engine = Liquid({
        root: '/views/',
        extname: '.html',
        cache: true
      })
      server.respondWith('GET', 'https://example.com/views/foo.html',
        [200, {'Content-Type': 'text/plain'}, 'foo1'])
      return engine.renderFile('foo.html')
        .then((html) => {
          expect(html).to.equal('foo1')
          server.respondWith('GET', 'https://example.com/views/foo.html',
            [200, {'Content-Type': 'text/plain'}, 'foo2'])
          return engine.renderFile('foo.html')
        })
        .then(html => expect(html).to.equal('foo1'))
    })
  })
})
