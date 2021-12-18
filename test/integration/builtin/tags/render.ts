import { Liquid, Drop } from '../../../../src/liquid'
import { expect, use } from 'chai'
import { mock, restore } from '../../../stub/mockfs'
import * as chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('tags/render', function () {
  let liquid: Liquid
  before(function () {
    liquid = new Liquid({
      root: '/',
      extname: '.html'
    })
  })
  afterEach(restore)
  it('should support render', async function () {
    mock({
      '/current.html': 'bar{% render "bar/foo.html" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html')
    expect(html).to.equal('barfoobar')
  })
  it('should support render', async function () {
    mock({
      '/current.html': 'bar{% render "foo.html" %}bar',
      '/partials/foo.html': 'foo'
    })
    const liquid = new Liquid({ partials: '/partials', root: '/' })
    const html = await liquid.renderFile('/current.html')
    expect(html).to.equal('barfoobar')
  })
  it('should support template string', async function () {
    mock({
      '/current.html': 'bar{% render "bar/{{name}}" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html', { name: 'foo.html' })
    expect(html).to.equal('barfoobar')
  })

  it('should throw when not specified', function () {
    mock({
      '/parent.html': '{%render%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('ParseError')
      expect(e.message).to.match(/illegal argument ""/)
    })
  })

  it('should throw when not exist', function () {
    mock({
      '/parent.html': '{%render not-exist%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('RenderError')
      expect(e.message).to.match(/illegal filename "undefined"/)
    })
  })

  it('should support render with relative path', async function () {
    mock({
      '/bar/foo.html': 'foo',
      '/foo/relative.html': 'bar{% render "../bar/foo.html" %}bar'
    })
    const html = await liquid.renderFile('foo/relative.html')
    expect(html).to.equal('barfoobar')
  })

  it('should support render: hash list', async function () {
    mock({
      '/hash.html': '{% assign name="harttle" %}{% render "user.html", role: "admin", alias: name %}',
      '/user.html': '{{role}} : {{alias}}'
    })
    const html = await liquid.renderFile('hash.html')
    expect(html).to.equal('admin : harttle')
  })

  it('should not bleed into child template', async function () {
    mock({
      '/hash.html': '{% assign name="harttle" %}InParent: {{name}} {% render "user.html" %}',
      '/user.html': 'InChild: {{name}}'
    })
    const html = await liquid.renderFile('hash.html')
    expect(html).to.equal('InParent: harttle InChild: ')
  })

  it('should allow argument reassignment', async function () {
    mock({
      '/parent.html': '{% render child.html, color: "red" %}',
      '/child.html': '{% assign color = "green" %}{{ color }}'
    })
    const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
    const html = await staticLiquid.renderFile('parent.html')
    return expect(html).to.equal('green')
  })

  it('should be able to access globals', async function () {
    liquid = new Liquid({ root: '/', extname: '.html', globals: { name: 'Harttle' } })
    mock({
      '/hash.html': 'InParent: {{name}} {% render "user.html" %}',
      '/user.html': 'InChild: {{name}}'
    })
    const html = await liquid.renderFile('hash', { name: 'harttle' })
    expect(html).to.equal('InParent: harttle InChild: Harttle')
  })

  it('should support with', async function () {
    mock({
      '/with.html': '{% render "color" with "red", shape: "rect" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('with.html')
    expect(html).to.equal('color:red, shape:rect')
  })
  it('should treat as normal key/value if followed by ":"', async () => {
    mock({
      '/with.html': '{% render "color" with: "foo" %}',
      '/color.html': 'color:{{color}}, with:{{with}}'
    })
    const html = await liquid.renderFile('with.html')
    expect(html).to.equal('color:, with:foo')
  })
  it('should treat as normal key if with value not specified', async () => {
    mock({
      '/with.html': '{% render "color" with, shape: "rect" %}',
      '/color.html': 'color:{{color}}, with:{{with}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('with.html')
    expect(html).to.equal('color:, with:true, shape:rect')
  })
  it('should support with...as', async function () {
    mock({
      '/with.html': '{% render "color" with color as c %}',
      '/color.html': 'color:{{c}}'
    })
    const html = await liquid.renderFile('with.html', { color: 'red' })
    expect(html).to.equal('color:red')
  })
  it('should support with...as and other parameters', async function () {
    mock({
      '/index.html': '{% render "item" with color as c, s: shape %}',
      '/item.html': 'color:{{c}}, shape:{{s}}'
    })
    const scope = { color: 'red', shape: 'rect' }
    const html = await liquid.renderFile('index.html', scope)
    expect(html).to.equal('color:red, shape:rect')
  })
  it('should support for...as', async function () {
    mock({
      '/index.html': '{% render "item" for colors as color %}',
      '/item.html': '{{forloop.index}}: {{color}}\n'
    })
    const html = await liquid.renderFile('index.html', { colors: ['red', 'green'] })
    expect(html).to.equal('1: red\n2: green\n')
  })
  it('should support for <non-array> as', async function () {
    mock({
      '/index.html': '{% render "item" for "green" as color %}',
      '/item.html': '{{forloop.index}}: {{color}}\n'
    })
    const html = await liquid.renderFile('index.html')
    expect(html).to.equal('1: green\n')
  })
  it('should support for without as', async function () {
    mock({
      '/index.html': '{% render "item" for colors %}',
      '/item.html': '{{forloop.index}}: {{color}}\n'
    })
    const html = await liquid.renderFile('index.html', { colors: ['red', 'green'] })
    expect(html).to.equal('1: \n2: \n')
  })
  it('should support for...as with other parameters', async function () {
    mock({
      '/index.html': '{% render "item" for colors as color with ".\n" as tail sep: ". "%}',
      '/item.html': '{{forloop.index}}{{sep}}{{color}}{{tail}}'
    })
    const html = await liquid.renderFile('index.html', { colors: ['red', 'green'] })
    expect(html).to.equal('1. red.\n2. green.\n')
  })
  it('should support for...as with other parameters (comma separated)', async function () {
    mock({
      '/index.html': '{% render "item" for colors as color, with ".\n" as tail, sep: ". "%}',
      '/item.html': '{{forloop.index}}{{sep}}{{color}}{{tail}}'
    })
    const html = await liquid.renderFile('index.html', { colors: ['red', 'green'] })
    expect(html).to.equal('1. red.\n2. green.\n')
  })
  it('should support render: with as Drop', async function () {
    class ColorDrop extends Drop {
      public valueOf (): string {
        return 'red!'
      }
    }
    mock({
      '/with.html': '{% render "color" with color %}',
      '/color.html': 'color:{{color}}'
    })
    const html = await liquid.renderFile('with.html', { color: new ColorDrop() })
    expect(html).to.equal('color:red!')
  })
  it('should support render: with passed as Drop', async function () {
    class ColorDrop extends Drop {
      public valueOf (): string {
        return 'red!'
      }
    }
    liquid.registerFilter('name', x => x.constructor.name)
    mock({
      '/with.html': '{% render "color" with color %}',
      '/color.html': '{{color | name}}'
    })
    const html = await liquid.renderFile('with.html', { color: new ColorDrop() })
    expect(html).to.equal('ColorDrop')
  })

  it('should support nested renders', async function () {
    mock({
      '/personInfo.html': 'This is a person {% render "card.html", person: person%}',
      '/card.html': '<p>{{person.firstName}} {{person.lastName}}<br/>{% render "address", address: person.address %}</p>',
      '/address.html': 'City: {{address.city}}'
    })
    const ctx = {
      person: {
        firstName: 'Joe',
        lastName: 'Shmoe',
        address: {
          city: 'Dallas'
        }
      }
    }
    const html = await liquid.renderFile('personInfo.html', ctx)
    expect(html).to.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>')
  })
  it('should support relative reference', async function () {
    mock({
      '/foo/coo/parent.html': 'X{% render ../bar/child.html, color:"red" %}Y',
      '/foo/bar/child.html': 'child with {{color}}'
    })
    const staticLiquid = new Liquid({ dynamicPartials: false, root: '/foo' })
    const html = await staticLiquid.renderFile('coo/parent.html')
    expect(html).to.equal('Xchild with redY')
  })
  it('should disable relative reference if specified', () => {
    mock({
      '/foo/coo/parent.html': 'X{% render ../bar/child.html, color:"red" %}Y',
      '/foo/bar/child.html': 'child with {{color}}'
    })
    const staticLiquid = new Liquid({ dynamicPartials: false, root: '/foo', relativeReference: false })
    return expect(staticLiquid.renderFile('coo/parent.html')).to.be.rejectedWith(/Failed to lookup/)
  })
  it('should throw not found if relative reference out of root', () => {
    mock({
      '/foo/parent.html': 'X{% render ../bar/child.html, color:"red" %}Y',
      '/bar/child.html': 'child with {{color}}'
    })
    const staticLiquid = new Liquid({ dynamicPartials: false, root: '/foo', partials: '/foo' })
    return expect(staticLiquid.renderFile('parent.html')).to.be.rejectedWith(/Failed to lookup "..\/bar\/child.html"/)
  })

  describe('static partial', function () {
    let staticLiquid: Liquid
    beforeEach(() => {
      staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
    })
    it('should support filename with extension', async function () {
      mock({
        '/parent.html': 'X{% render child.html color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const html = await staticLiquid.renderFile('parent.html')
      expect(html).to.equal('Xchild with redY')
    })

    it('should support parent paths', async function () {
      mock({
        '/parent.html': 'X{% render bar/./../foo/child.html %}Y',
        '/foo/child.html': 'child'
      })
      const html = await staticLiquid.renderFile('parent.html')
      expect(html).to.equal('XchildY')
    })

    it('should support subpaths', async function () {
      mock({
        '/parent.html': 'X{% render foo/child.html %}Y',
        '/foo/child.html': 'child'
      })
      const html = await staticLiquid.renderFile('parent.html')
      expect(html).to.equal('XchildY')
    })

    it('should support comma separated arguments', async function () {
      mock({
        '/parent.html': 'X{% render child.html, color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const html = await staticLiquid.renderFile('parent.html')
      expect(html).to.equal('Xchild with redY')
    })

    it('should support template string', async function () {
      mock({
        '/current.html': 'bar{% render bar/{{name}} %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = await staticLiquid.renderFile('/current.html', { name: 'foo.html' })
      expect(html).to.equal('barfoobar')
    })

    it('should support filters in template string', async function () {
      mock({
        '/current.html': 'bar{% render bar/{{name | append: ".html"}} %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = await staticLiquid.renderFile('/current.html', { name: 'foo' })
      expect(html).to.equal('barfoobar')
    })
  })
  describe('sync support', function () {
    it('should support quoted string', function () {
      mock({
        '/current.html': 'bar{% render "bar/foo.html" %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = liquid.renderFileSync('/current.html')
      expect(html).to.equal('barfoobar')
    })
    it('should support value string', function () {
      mock({
        '/current.html': 'bar{% render name %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = liquid.renderFileSync('/current.html', { name: '/bar/foo.html' })
      expect(html).to.equal('barfoobar')
    })
    it('should support template string', function () {
      mock({
        '/current.html': 'bar{% render "/bar/{{name}}" %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = liquid.renderFileSync('/current.html', { name: '/foo.html' })
      expect(html).to.equal('barfoobar')
    })
    it('should support with', function () {
      mock({
        '/with.html': '{% render "color" with "red", shape: "rect" %}',
        '/color.html': 'color:{{color}}, shape:{{shape}}'
      })
      const html = liquid.renderFileSync('with.html')
      expect(html).to.equal('color:red, shape:rect')
    })
    it('should support filename with extension', function () {
      mock({
        '/parent.html': 'X{% render child.html color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = staticLiquid.renderFileSync('parent.html')
      expect(html).to.equal('Xchild with redY')
    })
  })
})
