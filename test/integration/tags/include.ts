import { Liquid } from '../../../src/liquid'
import { Drop } from '../../../src/drop/drop'
import { expect } from 'chai'
import { mock, restore } from '../../stub/mockfs'

describe('tags/include', function () {
  let liquid: Liquid
  before(function () {
    liquid = new Liquid({
      root: '/',
      extname: '.html'
    })
  })
  afterEach(restore)
  it('should support include', async function () {
    mock({
      '/current.html': 'bar{% include "bar/foo.html" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html')
    return expect(html).to.equal('barfoobar')
  })
  it('should support relative reference', async function () {
    mock({
      '/foo/bar/current.html': 'bar{% include "../coo/foo.html" %}bar',
      '/foo/coo/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/foo/bar/current.html')
    return expect(html).to.equal('barfoobar')
  })
  it('should support template string', async function () {
    mock({
      '/current.html': 'bar{% include "bar/{{name}}" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html', { name: 'foo.html' })
    return expect(html).to.equal('barfoobar')
  })
  it('should allow escape in template string', async function () {
    mock({
      '/current.html': 'bar{% include "bar/{{name | append: \\".html\\"}}" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html', { name: 'foo' })
    return expect(html).to.equal('barfoobar')
  })

  it('should throw when not specified', function () {
    mock({
      '/parent.html': '{%include , %}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('ParseError')
      expect(e.message).to.match(/illegal argument ","/)
    })
  })

  it('should throw when not exist', function () {
    mock({
      '/parent.html': '{%include not-exist%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('RenderError')
      expect(e.message).to.match(/illegal filename "undefined"/)
    })
  })

  it('should support include with relative path', async function () {
    mock({
      '/bar/foo.html': 'foo',
      '/foo/relative.html': 'bar{% include "../bar/foo.html" %}bar'
    })
    const html = await liquid.renderFile('foo/relative.html')
    return expect(html).to.equal('barfoobar')
  })

  it('should support include: hash list', async function () {
    mock({
      '/hash.html': '{% assign name="harttle" %}{% include "user.html", role: "admin", alias: name %}',
      '/user.html': '{{name}} : {{role}} : {{alias}}'
    })
    const html = await liquid.renderFile('hash.html')
    return expect(html).to.equal('harttle : admin : harttle')
  })

  it('should support include: parent scope', async function () {
    mock({
      '/scope.html': '{% assign shape="triangle" %}{% assign color="yellow" %}{% include "color.html" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('scope.html')
    return expect(html).to.equal('color:yellow, shape:triangle')
  })

  it('should support include: with', async function () {
    mock({
      '/with.html': '{% include "color" with "red", shape: "rect" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('with.html')
    return expect(html).to.equal('color:red, shape:rect')
  })
  it('should ignore if with value not specified', async function () {
    mock({
      '/with.html': '{% include "color" with, shape: "rect" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('with.html')
    return expect(html).to.equal('color:, shape:rect')
  })
  it('should treat with as a valid key', async function () {
    mock({
      '/with.html': '{% include "color" with: "foo" %}',
      '/color.html': 'with:{{with}}'
    })
    const html = await liquid.renderFile('with.html')
    return expect(html).to.equal('with:foo')
  })
  it('should support include: with as Drop', async function () {
    class ColorDrop extends Drop {
      public valueOf (): string {
        return 'red!'
      }
    }
    mock({
      '/with.html': '{% include "color" with color %}',
      '/color.html': 'color:{{color}}'
    })
    const html = await liquid.renderFile('with.html', { color: new ColorDrop() })
    expect(html).to.equal('color:red!')
  })
  it('should support include: with passed as Drop', async function () {
    class ColorDrop extends Drop {
      public valueOf (): string {
        return 'red!'
      }
    }
    liquid.registerFilter('name', x => x.constructor.name)
    mock({
      '/with.html': '{% include "color" with color %}',
      '/color.html': '{{color | name}}'
    })
    const html = await liquid.renderFile('with.html', { color: new ColorDrop() })
    expect(html).to.equal('ColorDrop')
  })

  it('should support nested includes', async function () {
    mock({
      '/personInfo.html': 'This is a person {% include "card.html" %}',
      '/card.html': '<p>{{person.firstName}} {{person.lastName}}<br/>{% include "address" %}</p>',
      '/address.html': 'City: {{person.address.city}}'
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
    return expect(html).to.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>')
  })

  describe('static partial', function () {
    it('should support filename with extension', async function () {
      mock({
        '/parent.html': 'X{% include child.html color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('Xchild with redY')
    })

    it('should support parent paths', async function () {
      mock({
        '/parent.html': 'X{% include bar/./../foo/child.html %}Y',
        '/foo/child.html': 'child'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('XchildY')
    })

    it('should support subpaths', async function () {
      mock({
        '/parent.html': 'X{% include foo/child.html %}Y',
        '/foo/child.html': 'child'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('XchildY')
    })

    it('should support comma separated arguments', async function () {
      mock({
        '/parent.html': 'X{% include child.html, color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('Xchild with redY')
    })

    it('should support single liquid output', async function () {
      mock({
        '/parent.html': 'X{% include {{child}}, color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html', { child: 'child.html' })
      return expect(html).to.equal('Xchild with redY')
    })
  })
  describe('sync support', function () {
    it('should support quoted string', function () {
      mock({
        '/current.html': 'bar{% include "bar/foo.html" %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = liquid.renderFileSync('/current.html')
      return expect(html).to.equal('barfoobar')
    })
    it('should support variable', function () {
      mock({
        '/current.html': 'bar{% include name %}bar',
        '/bar/foo.html': 'foo'
      })
      const html = liquid.renderFileSync('/current.html', { name: '/bar/foo.html' })
      return expect(html).to.equal('barfoobar')
    })
    it('should support include: with', function () {
      mock({
        '/with.html': '{% include "color" with "red", shape: "rect" %}',
        '/color.html': 'color:{{color}}, shape:{{shape}}'
      })
      const html = liquid.renderFileSync('with.html')
      return expect(html).to.equal('color:red, shape:rect')
    })
    it('should support filename with extension', function () {
      mock({
        '/parent.html': 'X{% include child.html color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = staticLiquid.renderFileSync('parent.html')
      return expect(html).to.equal('Xchild with redY')
    })
  })

  describe('Jekyll include', function () {
    before(function () {
      liquid = new Liquid({
        root: '/',
        extname: '.html',
        jekyllInclude: true
      })
    })
    it('should support Jekyll style include', function () {
      mock({
        '/current.html': '{% include bar/foo.html content="FOO" %}',
        '/bar/foo.html': '{{include.content}}-{{content}}'
      })
      const html = liquid.renderFileSync('/current.html')
      return expect(html).to.equal('FOO-')
    })
    it('should support multiple parameters', function () {
      mock({
        '/current.html': '{% include bar/foo.html header="HEADER" content="CONTENT" %}',
        '/bar/foo.html': '<h2>{{include.header}}</h2>{{include.content}}'
      })
      const html = liquid.renderFileSync('/current.html')
      return expect(html).to.equal('<h2>HEADER</h2>CONTENT')
    })
    it('should support dynamicPartials=true', function () {
      mock({
        '/current.html': '{% include "bar/foo.html" content="FOO" %}',
        '/bar/foo.html': '{{include.content}}-{{content}}'
      })
      liquid = new Liquid({
        root: '/',
        extname: '.html',
        jekyllInclude: true,
        dynamicPartials: true
      })
      const html = liquid.renderFileSync('/current.html')
      return expect(html).to.equal('FOO-')
    })
  })
})
