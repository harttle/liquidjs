import { Liquid } from '../../../src/liquid'

describe('LiquidOptions#fs', function () {
  let engine: Liquid
  const fs = {
    sep: '/',
    dirname: (x: string) => x.split('/').slice(0, -1).join('/'),
    exists: (x: string) => Promise.resolve(!x.match(/not-exist/)),
    existsSync: (x: string) => !x.match(/not-exist/),
    readFile: (x: string) => Promise.resolve(`content for ${x}`),
    readFileSync: (x: string) => `content for ${x}`,
    fallback: (x: string) => '/root/files/fallback',
    resolve: (base: string, path: string) => base + '/' + path
  }
  beforeEach(function () {
    engine = new Liquid({
      root: '/root',
      fs
    } as any)
  })
  it('should be used to read templates', async function () {
    const html = await engine.renderFile('files/foo')
    expect(html).toBe('content for /root/files/foo')
  })

  it('should support fallback', async function () {
    const html = await engine.renderFile('not-exist/foo')
    expect(html).toBe('content for /root/files/fallback')
  })

  it('should support renderSync', function () {
    const html = engine.renderFileSync('not-exist/foo')
    expect(html).toBe('content for /root/files/fallback')
  })

  it('should throw lookup failure if fallback not specified', function () {
    const engine = new Liquid({
      root: '/root/',
      fs: { ...fs, fallback: undefined }
    } as any)
    return expect(engine.renderFile('not-exist/foo'))
      .rejects.toThrow('Failed to lookup')
  })

  it('should disable relativeReference if `sep` and `dirname` not specified', function () {
    const engine = new Liquid({
      root: '/root/',
      fs: { ...fs, sep: undefined, dirname: undefined }
    } as any)
    expect(engine.options.relativeReference).toBe(false)
  })
  it('should render from in-memory templates', () => {
    const engine = new Liquid({
      templates: {
        entry: '{% layout "main" %}entry',
        main: 'header {% block %}{% endblock %} footer'
      }
    })
    expect(engine.renderFileSync('entry')).toEqual('header entry footer')
  })
  it('should render relative in-memory templates', () => {
    const engine = new Liquid({
      templates: {
        'views/entry': 'header {% include "../partials/footer" %}',
        'partials/footer': 'footer'
      }
    })
    expect(engine.renderFileSync('views/entry')).toEqual('header footer')
  })
  it('should ignore root/layouts/partials', () => {
    const engine = new Liquid({
      root: '/foo/bar/',
      layouts: '/foo/bar/',
      partials: '/foo/bar/',
      templates: {
        entry: '{% layout "main" %}entry',
        main: 'header {% block %}{% endblock %} footer'
      }
    })
    expect(engine.renderFileSync('entry')).toEqual('header entry footer')
  })
})
