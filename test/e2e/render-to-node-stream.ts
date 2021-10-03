import { expect, use } from 'chai'
import { resolve } from 'path'
import * as chaiAsPromised from 'chai-as-promised'
import { drainStream } from '../stub/stream'

use(chaiAsPromised)

describe('.renderToNodeStream()', function () {
  it('should render to stream in Node.js', done => {
    const cjs = require('../../dist/liquid.node.cjs')
    const engine = new cjs.Liquid()
    const tpl = engine.parseFileSync(resolve(__dirname, '../stub/root/foo.html'))
    const stream = engine.renderToNodeStream(tpl)
    let html = ''
    stream.on('data', (data: string) => { html += data })
    stream.on('end', () => {
      try {
        expect(html).to.equal('foo')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('should throw in browser', async function () {
    const cjs = require('../../dist/liquid.browser.umd')
    const engine = new cjs.Liquid()
    const render = () => engine.renderToNodeStream('foo')
    return expect(render).to.throw('streaming not supported in browser')
  })
})

describe('.renderFileToNodeStream()', function () {
  it('should render to stream in Node.js', async () => {
    const cjs = require('../../dist/liquid.node.cjs')
    const engine = new cjs.Liquid({
      root: resolve(__dirname, '../stub/root/')
    })
    const stream = await engine.renderFileToNodeStream('foo.html')
    expect(drainStream(stream)).to.eventually.equal('foo')
  })
})
