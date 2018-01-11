const chai = require('chai')
const expect = chai.expect
const url = require('../../src/util/url.js')
const { JSDOM } = require('jsdom')

describe('util/url', function () {
  var dom
  beforeEach(function () {
    dom = new JSDOM(``, {
      url: 'https://example.com/foo/bar/',
      contentType: 'text/html',
      includeNodeLocations: true
    })
    global.document = dom.window.document
  })
  afterEach(function () {
    delete global.document
  })
  describe('resolve', function () {
    describe('root', function () {
      it('should support width relative path', function () {
        expect(url.resolve('./views', 'foo'))
          .to.equal('https://example.com/foo/bar/views/foo')
        expect(url.resolve('./views/', 'foo'))
          .to.equal('https://example.com/foo/bar/views/foo')
      })
      it('should support width absolute path', function () {
        expect(url.resolve('/views', 'foo'))
          .to.equal('https://example.com/views/foo')
        expect(url.resolve('/views/', 'foo'))
          .to.equal('https://example.com/views/foo')
      })
      it('should support with empty', function () {
        expect(url.resolve('', 'page.html'))
          .to.equal('https://example.com/foo/bar/page.html')
      })
      it('should support with url', function () {
        expect(url.resolve('https://example.com/views', 'page.html'))
          .to.equal('https://example.com/views/page.html')
        expect(url.resolve('https://example.com/views/', 'page.html'))
          .to.equal('https://example.com/views/page.html')
      })
      it('should get the first value when argument is array', function () {
        expect(url.resolve(['https://example.com/views', 'https://google.com/views'], 'page.html'))
          .to.equal('https://example.com/views/page.html')
        expect(url.resolve(['https://example.com/views/', 'https://google.com/views'], 'page.html'))
          .to.equal('https://example.com/views/page.html')
      })
    })
    describe('path', function () {
      it('should support width relative path', function () {
        expect(url.resolve('./views/', 'page.html'))
          .to.equal('https://example.com/foo/bar/views/page.html')
      })
      it('should support with absolute path', function () {
        expect(url.resolve('/views/', '/page.html'))
          .to.equal('https://example.com/page.html')
      })
    })
  })
})
