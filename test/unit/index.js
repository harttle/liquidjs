import Liquid from '../../src/index.js'
import mock from 'mock-fs'
import chai from 'chai'

const expect = chai.expect

describe('Liquid', function () {
  describe('#constructor()', function () {
    it('should throw on illegal root', function () {
      expect(() => {
        new Liquid({root: {}}) // eslint-disable-line
      }).to.throw(/illegal root/)
    })
  })
  describe('#express()', function () {
    const liquid = new Liquid({root: '/root'})
    const render = liquid.express()
    before(function () {
      mock({
        '/root/foo': 'foo'
      })
    })
    after(function () {
      mock.restore()
    })
    it('should render single template', function (done) {
      render.call({root: '.'}, 'foo', null, (err, result) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
    it('should render single template with Array-typed root', function (done) {
      render.call({root: ['.']}, 'foo', null, (err, result) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
  })
})
