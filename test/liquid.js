const chai = require('chai')
const expect = chai.expect
const Liquid = require('..')
const mock = require('mock-fs')
chai.use(require('chai-as-promised'))

describe('liquid', function () {
  var engine, strictEngine, ctx
  beforeEach(function () {
    ctx = {
      name: 'harttle',
      arr: [-2, 'a'],
      obj: {
        foo: 'bar'
      }
    }
    engine = Liquid({
      root: '/root/',
      extname: '.html'
    })
    strictEngine = Liquid({
      root: '/root',
      extname: '.html',
      strict_filters: true
    })
    mock({
      '/root/files/foo.html': 'foo',
      '/root/files/name.html': 'My name is {{name}}.',
      '/un-readable.html': mock.file({
        mode: '0000'
      })
    })
  })
  afterEach(function () {
    mock.restore()
  })
  describe('{{output}}', function () {
    it('should output object', function () {
      return expect(engine.parseAndRender('{{obj}}', ctx)).to.eventually.equal('{"foo":"bar"}')
    })
    it('should output array', function () {
      return expect(engine.parseAndRender('{{arr}}', ctx)).to.eventually.equal('[-2,"a"]')
    })
    it('should output undefined to empty', function () {
      return expect(engine.parseAndRender('foo{{zzz}}bar', ctx)).to.eventually.equal('foobar')
    })
    it('should render as null when filter undefined', function () {
      return expect(engine.parseAndRender('{{"foo" | filter1}}', ctx)).to.eventually.equal('foo')
    })
    it('should throw upon undefined filter when strict_filters set', function () {
      return expect(strictEngine.parseAndRender('{{arr | filter1}}', ctx)).to
        .be.rejectedWith(/undefined filter: filter1/)
    })
  })
  it('should parse html', function () {
    expect(function () {
      engine.parse('{{obj}}')
    }).to.not.throw()
    expect(function () {
      engine.parse('<html><head>{{obj}}</head></html>')
    }).to.not.throw()
  })
  it('should render template multiple times', function () {
    var template = engine.parse('{{obj}}')
    return engine.render(template, ctx)
      .then((result) => {
        expect(result).to.equal('{"foo":"bar"}')
        return engine.render(template, ctx)
      })
      .then((result) => {
        return expect(result).to.equal('{"foo":"bar"}')
      })
  })
  it('should render filters', function () {
    var template = engine.parse('<p>{{arr | join: "_"}}</p>')
    return expect(engine.render(template, ctx)).to.eventually.equal('<p>-2_a</p>')
  })
  it('should render accessive filters', function () {
    var src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
      '{{ my_array | first }}'
    return expect(engine.parseAndRender(src)).to.eventually.equal('apples')
  })
  describe('#renderFile()', function () {
    it('should render file', function () {
      return expect(engine.renderFile('/root/files/foo.html', ctx))
        .to.eventually.equal('foo')
    })
    it('should accept relative path', function () {
      return expect(engine.renderFile('files/foo.html'))
        .to.eventually.equal('foo')
    })
    it('should resolve array as root', function () {
      engine = Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(engine.renderFile('files/foo.html'))
        .to.eventually.equal('foo')
    })
    it('should default root to cwd', function () {
      var files = {}
      files[process.cwd() + '/foo.html'] = 'FOO'
      mock(files)

      engine = Liquid({
        extname: '.html'
      })
      return expect(engine.renderFile('foo.html'))
        .to.eventually.equal('FOO')
    })
    it('should render file with context', function () {
      return expect(engine.renderFile('/root/files/name.html', ctx)).to.eventually.equal('My name is harttle.')
    })
    it('should use default extname', function () {
      return expect(engine.renderFile('files/name', ctx)).to.eventually.equal('My name is harttle.')
    })
    it('should throw with lookup list when file not exist', function () {
      engine = Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(engine.renderFile('/not/exist.html')).to
        .be.rejectedWith(/failed to lookup \/not\/exist.html in: \/boo,\/root\//i)
    })
    it('should throw when file not readable', function () {
      return expect(engine.renderFile('/un-readable.html')).to
        .be.rejectedWith(/EACCES/)
    })
  })
  describe('strict', function () {
    it('should not throw when strict_variables false (default)', function () {
      return expect(engine.parseAndRender('before{{notdefined}}after', ctx)).to
        .eventually.equal('beforeafter')
    })
    it('should throw when strict_variables true', function () {
      var tpl = engine.parse('before{{notdefined}}after')
      var opts = {
        strict_variables: true
      }
      return expect(engine.render(tpl, ctx, opts)).to
        .be.rejectedWith(/undefined variable: notdefined/)
    })
    it('should pass strict_variables to render by parseAndRender', function () {
      var html = 'before{{notdefined}}after'
      var opts = {
        strict_variables: true
      }
      return expect(engine.parseAndRender(html, ctx, opts)).to
        .be.rejectedWith(/undefined variable: notdefined/)
    })
  })
  describe('cache', function () {
    it('should be disabled by default', function () {
      return engine.renderFile('files/foo')
        .then(x => expect(x).to.equal('foo'))
        .then(() => mock({
          '/root/files/foo.html': 'bar'
        }))
        .then(() => engine.renderFile('files/foo'))
        .then(x => expect(x).to.equal('bar'))
    })
    it('should respect cache=true option', function () {
      engine = Liquid({
        root: '/root/',
        extname: '.html',
        cache: true
      })
      return engine.renderFile('files/foo')
        .then(x => expect(x).to.equal('foo'))
        .then(() => mock({
          '/root/files/foo.html': 'bar'
        }))
        .then(() => engine.renderFile('files/foo'))
        .then(x => expect(x).to.equal('foo'))
    })
  })
  describe('trim_left, trim_right', function () {
    it('should trim_left for tags when trim_left=true', function () {
      engine = Liquid({
        trim_left: true
      })
      return expect(engine.parseAndRender(' \n \t{%if true%}foo{%endif%} '))
        .to.eventually.equal(' \nfoo ')
    })
    it('should trim_right for tags when trim_right=true', function () {
      engine = Liquid({
        trim_right: true
      })
      return expect(engine.parseAndRender('\t{%if true%}foo{%endif%} \n'))
        .to.eventually.equal('\tfoo')
    })
    it('should trim all blanks before and after when greedy=true', function () {
      engine = Liquid({
        greedy: true
      })
      return expect(engine.parseAndRender('\t{%-if true%}foo{%endif-%} \n \n'))
        .to.eventually.equal('foo')
    })
    it('should support trim using markup', function () {
      engine = Liquid()
      var src = [
        '{%- assign username = "John G. Chalmers-Smith" -%}',
        '{%- if username and username.length > 10 -%}',
        '  Wow, {{ username }}, you have a long name!',
        '{%- else -%}',
        '  Hello there!',
        '{%- endif -%}\n'
      ].join('\n')
      var dst = '  Wow, John G. Chalmers-Smith, you have a long name!\n'
      return expect(engine.parseAndRender(src)).to.eventually.equal(dst)
    })
    it('should not trim when not specified', function () {
      engine = Liquid()
      var src = [
        '{% assign username = "John G. Chalmers-Smith" %}',
        '{% if username and username.length > 10 %}',
        '  Wow, {{ username }}, you have a long name!',
        '{% else %}',
        '  Hello there!',
        '{% endif %}\n'
      ].join('\n')
      var dst = '\n\n  Wow, John G. Chalmers-Smith, you have a long name!\n\n'
      return expect(engine.parseAndRender(src)).to.eventually.equal(dst)
    })
  })
})
