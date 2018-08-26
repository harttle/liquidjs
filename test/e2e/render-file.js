var chai = require('chai')
var mock = require('mock-fs')
var Liquid = require('../..')
var expect = chai.expect

chai.use(require('chai-as-promised'))

describe('#renderFile()', function () {
  var engine
  beforeEach(function () {
    engine = Liquid({
      root: '/root/',
      extname: '.html'
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
  it('should ignore invalid root option', function () {
    var liquid = Liquid({ root: /regex/ })
    expect(liquid.options.root).to.deep.equal([])
  })
  it('should render file', function () {
    return expect(engine.renderFile('/root/files/foo.html', {}))
      .to.eventually.equal('foo')
  })
  it('should find files without extname', function () {
    var engine = Liquid({root: '/root'})
    return expect(engine.renderFile('/root/files/bar', {}))
      .to.eventually.equal('bar')
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
    return expect(engine.renderFile('/root/files/name.html', {name: 'harttle'}))
      .to.eventually.equal('My name is harttle.')
  })
  it('should use default extname', function () {
    return expect(engine.renderFile('files/name', {name: 'harttle'})).to.eventually.equal('My name is harttle.')
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
