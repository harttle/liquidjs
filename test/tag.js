const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))

var tag = require('../src/tag.js')()
var Scope = require('../src/scope.js')

describe('tag', function () {
  var scope
  before(function () {
    scope = Scope.factory({
      foo: 'bar',
      arr: [2, 1],
      bar: {
        coo: 'uoo'
      }
    })
    tag.clear()
  })

  it('should throw when not registered', function () {
    expect(function () {
      tag.construct({
        type: 'tag',
        value: 'foo',
        name: 'foo'
      }, [])
    }).to.throw(/tag foo not found/)
  })

  it('should register simple tag', function () {
    expect(function () {
      tag.register('foo', {
        render: x => 'bar'
      })
    }).not.throw()
  })

  it('should call tag.render', function () {
    var spy = sinon.spy()
    tag.register('foo', {
      render: spy
    })
    return tag
            .construct({
              type: 'tag',
              value: 'foo',
              name: 'foo'
            }, [])
            .render(scope, {})
            .then(() => expect(spy).to.have.been.called)
  })

  describe('hash', function () {
    var spy, token
    beforeEach(function () {
      spy = sinon.spy()
      tag.register('foo', {
        render: spy
      })
      token = {
        type: 'tag',
        value: 'foo aa:foo bb: arr[0] cc: 2.3\ndd:bar.coo',
        name: 'foo',
        args: 'aa:foo bb: arr[0] cc: 2.3\ndd:bar.coo'
      }
    })
    it('should call tag.render with scope', function () {
      return tag.construct(token, []).render(scope, {})
                .then(() => expect(spy).to.have.been.calledWithMatch(scope))
    })
    it('should resolve identifier hash', function () {
      return tag.construct(token, []).render(scope, {})
                .then(() => expect(spy).to.have.been.calledWithMatch({}, {
                  aa: 'bar'
                }))
    })
    it('should accept space between key/value', function () {
      return tag.construct(token, []).render(scope, {})
                .then(() => expect(spy).to.have.been.calledWithMatch({}, {
                  bb: 2
                }))
    })
    it('should resolve number value hash', function () {
      return tag.construct(token, []).render(scope, {})
                .then(() => expect(spy).to.have.been.calledWithMatch(scope, {
                  cc: 2.3
                }))
    })
    it('should resolve property access hash', function () {
      return tag.construct(token, []).render(scope, {})
                .then(() => expect(spy).to.have.been.calledWithMatch(scope, {
                  dd: 'uoo'
                }))
    })
  })
})
