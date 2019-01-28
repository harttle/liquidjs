import { read } from '../../src/template-browser.js'
import sinon from 'sinon'
import chai from 'chai'

chai.use(require('chai-as-promised'))

const expect = chai.expect

describe('template-browser', () => {
  if (process.version.match(/^v(\d+)/)[1] < 8) {
    console.info('jsdom not supported, skipping xhr...')
    return
  }
  let server
  beforeEach(() => {
    server = sinon.createFakeServer()
    server.autoRespond = true
    server.respondWith('GET', 'https://example.com/views/hello.html',
      [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}'])
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest()
  })
  afterEach(() => {
    server.restore()
    delete global.XMLHttpRequest
  })
  describe('#read()', () => {
    it('should get corresponding text', () => {
      return expect(read('https://example.com/views/hello.html'))
        .to.eventually.equal('hello {{name}}')
    })
    it('should throw 404', () => {
      return expect(read('https://example.com/not/exist.html'))
        .to.be.rejectedWith('Not Found')
    })
    it('should throw error', function (done) {
      read('https://example.com/views/hello.html')
        .then(() => done('should not be resolved'))
        .catch(function (e) {
          expect(e.message).to.equal('An error occurred whilst receiving the response.')
          done()
        })
      server.requests[0].error()
    })
  })
})
