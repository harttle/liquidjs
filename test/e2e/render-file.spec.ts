import { Liquid } from '../..'
import { resolve } from 'path'

describe('#renderFile()', function () {
  const root = resolve(__dirname, '../stub/root')
  const views = resolve(__dirname, '../stub/views')
  let engine: Liquid
  beforeEach(function () {
    engine = new Liquid({
      root,
      extname: '.html'
    })
  })
  it('should render file', async function () {
    const html = await engine.renderFile(resolve(root, 'foo.html'), {})
    return expect(html).toBe('foo')
  })
  it('should find files without extname', async function () {
    var engine = new Liquid({ root })
    const html = await engine.renderFile(resolve(root, 'bar'), {})
    return expect(html).toBe('bar')
  })
  it('should accept relative path', async function () {
    const html = await engine.renderFile('foo.html')
    return expect(html).toBe('foo')
  })
  it('should traverse root array', async function () {
    engine = new Liquid({
      root: ['/boo', root],
      extname: '.html'
    })
    const html = await engine.renderFile('foo.html')
    return expect(html).toBe('foo')
  })
  it('should default root to cwd', async function () {
    engine = new Liquid()
    const html = await engine.renderFile('package.json')
    return expect(html).toContain('"name": "liquidjs"')
  })
  it('should render file with context', async function () {
    const html = await engine.renderFile(resolve(views, 'name.html'), { name: 'harttle' })
    return expect(html).toBe('My name is harttle.')
  })
  it('should use default extname', async function () {
    const html = await engine.renderFile(resolve(root, 'foo'))
    return expect(html).toBe('foo')
  })
  it('should throw with lookup list when file not exist', function () {
    engine = new Liquid({
      root: ['/boo', '/root/'],
      extname: '.html'
    })
    return expect(engine.renderFile('/not/exist.html')).rejects.toThrow(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
  })
  it('should handle "." as cwd', async () => {
    engine = new Liquid({
      root: ['.'],
      extname: '.html'
    })
    process.chdir(resolve(__dirname, '../stub/views'))
    await expect(engine.renderFile('bar')).resolves.toEqual('BAR')
    process.chdir(resolve(__dirname, '../stub/partials'))
    await expect(engine.renderFile('bar')).resolves.toEqual('bar')
  })
})
