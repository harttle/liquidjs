import { resolve } from '../../src/template-browser'
import * as chai from 'chai'

const expect = chai.expect

describe('template-browser', function () {
  if (process.version.match(/^v(\d+)/)[1] < 8) {
    console.info('jsdom not supported, skipping template-browser...')
    return
  }
  const JSDOM = require('jsdom').JSDOM
  beforeEach(function () {
    const dom = new JSDOM(``, {
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
    it('should support relative root', function () {
      expect(resolve('foo', './views/', {
        extname: '',
        root: ['.']
      })).to.equal('https://example.com/foo/bar/views/foo')
    })
    it('should treat root as directory', function () {
      expect(resolve('foo', './views', {
        extname: '',
        root: ['.']
      })).to.equal('https://example.com/foo/bar/views/foo')
    })
    it('should support absolute root', function () {
      expect(resolve('foo', '/views', {
        extname: '',
        root: ['.']
      })).to.equal('https://example.com/views/foo')
    })
    it('should support empty root', function () {
      expect(resolve('page.html', '', {
        extname: '',
        root: ['.']
      })).to.equal('https://example.com/foo/bar/page.html')
    })
    it('should support full url as root', function () {
      expect(resolve('page.html', 'https://example.com/views/', {
        extname: '',
        root: ['.']
      })).to.equal('https://example.com/views/page.html')
    })
    it('should use options.root when root argument absent', function () {
      expect(resolve('page.html', null, {
        extname: '',
        root: ['https://example.com/views', 'https://google.com/views']
      })).to.equal('https://example.com/views/page.html')
    })
    it('should add extname when absent', function () {
      expect(resolve('page', 'https://example.com/views/', {
        extname: '.html',
        root: ['.']
      })).to.equal('https://example.com/views/page.html')
    })
    it('should add extname for urls have searchParams', function () {
      expect(resolve('page?foo=bar', 'https://example.com/views/', {
        extname: '.html',
        root: ['.']
      })).to.equal('https://example.com/views/page.html?foo=bar')
    })
    it('should not add extname when full url is given', function () {
      expect(resolve('https://google.com/page.php', 'https://example.com/views/', {
        extname: '.html',
        root: ['.']
      })).to.equal('https://google.com/page.php')
    })
    it('should not add extname when already have one', function () {
      expect(resolve('page.php', 'https://example.com/views/', {
        extname: '.html',
        root: ['.']
      })).to.equal('https://example.com/views/page.php')
    })
  })
})
