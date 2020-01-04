import { expect } from 'chai'
import { Liquid } from '../../../src/liquid'

describe('LiquidOptions#fs', function () {
  let engine: Liquid
  const fs = {
    exists: (x: string) => Promise.resolve(x.match(/^\/root\/files\//)),
    existsSync: (x: string) => x.match(/^\/root\/files\//),
    readFile: (x: string) => Promise.resolve(`content for ${x}`),
    readFileSync: (x: string) => `content for ${x}`,
    fallback: (x: string) => '/root/files/fallback',
    resolve: (base: string, path: string) => base + path
  }
  beforeEach(function () {
    engine = new Liquid({
      root: '/root/',
      fs
    } as any)
  })
  it('should be used to read templates', async function () {
    const html = await engine.renderFile('files/foo')
    expect(html).to.equal('content for /root/files/foo')
  })

  it('should support fallback', async function () {
    const html = await engine.renderFile('notexist/foo')
    expect(html).to.equal('content for /root/files/fallback')
  })

  it('should support renderSync', function () {
    const html = engine.renderFileSync('notexist/foo')
    expect(html).to.equal('content for /root/files/fallback')
  })
})
