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
      '/root/files/bar': 'bar',
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
  describe('Liquid', function () {
    it('should ignore invalid root option', function () {
      var liquid = Liquid({ root: /regex/ })
      expect(liquid.options.root).to.deep.equal([])
    })
  })
  describe('{{value}}', function () {
    it('should value object', function () {
      return expect(engine.parseAndRender('{{obj}}', ctx)).to.eventually.equal('{"foo":"bar"}')
    })
    it('should value array', function () {
      return expect(engine.parseAndRender('{{arr}}', ctx)).to.eventually.equal('[-2,"a"]')
    })
    it('should value undefined to empty', function () {
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
      .then(result => expect(result).to.equal('{"foo":"bar"}'))
      .then(() => engine.render(template, ctx))
      .then((result) => expect(result).to.equal('{"foo":"bar"}'))
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
  // describe('#renderFile()', function () {
  //   it('should render file', function () {
  //     return expect(engine.renderFile('/root/files/foo.html', ctx))
  //       .to.eventually.equal('foo')
  //   })
  //   it('should find files without extname', function () {
  //     var engine = Liquid({root: '/root'})
  //     return expect(engine.renderFile('/root/files/bar', ctx))
  //       .to.eventually.equal('bar')
  //   })
  //   it('should accept relative path', function () {
  //     return expect(engine.renderFile('files/foo.html'))
  //       .to.eventually.equal('foo')
  //   })
  //   it('should resolve array as root', function () {
  //     engine = Liquid({
  //       root: ['/boo', '/root/'],
  //       extname: '.html'
  //     })
  //     return expect(engine.renderFile('files/foo.html'))
  //       .to.eventually.equal('foo')
  //   })
  //   it('should default root to cwd', function () {
  //     var files = {}
  //     files[process.cwd() + '/foo.html'] = 'FOO'
  //     mock(files)

  //     engine = Liquid({
  //       extname: '.html'
  //     })
  //     return expect(engine.renderFile('foo.html'))
  //       .to.eventually.equal('FOO')
  //   })
  //   it('should render file with context', function () {
  //     return expect(engine.renderFile('/root/files/name.html', ctx)).to.eventually.equal('My name is harttle.')
  //   })
  //   it('should use default extname', function () {
  //     return expect(engine.renderFile('files/name', ctx)).to.eventually.equal('My name is harttle.')
  //   })
  //   it('should throw with lookup list when file not exist', function () {
  //     engine = Liquid({
  //       root: ['/boo', '/root/'],
  //       extname: '.html'
  //     })
  //     return expect(engine.renderFile('/not/exist.html')).to
  //       .be.rejectedWith(/failed to lookup \/not\/exist.html in: \/boo,\/root\//i)
  //   })
  //   it('should throw when file not readable', function () {
  //     return expect(engine.renderFile('/un-readable.html')).to
  //       .be.rejectedWith(/EACCES/)
  //   })
  // })
})
