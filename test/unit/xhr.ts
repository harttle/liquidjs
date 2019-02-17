import { read } from 'src/parser/template-browser'
import * as sinon from 'sinon'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('xhr', () => {
  if (+process.version.match(/^v(\d+)/)[1] < 8) {
    console.info('jsdom not supported, skipping xhr...')
    return
  }
  let server
  beforeEach(() => {
    server = sinon.createFakeServer()
    server.autoRespond = true
    server.respondWith('GET', 'https://example.com/views/hello.html',
      [200, { 'Content-Type': 'text/plain' }, 'hello {{name}}']);
    (global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest()
  })
  afterEach(() => {
    server.restore()
    delete (global as any).XMLHttpRequest
  })
  describe('#read()', () => {
    it('should get corresponding text', async function () {
      const html = await read('https://example.com/views/hello.html')
      return expect(html).to.equal('hello {{name}}')
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
