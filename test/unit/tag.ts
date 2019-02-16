import * as chai from 'chai'
import Tag from 'src/template/tag/tag'
import TagToken from 'src/parser/tag-token'
import Scope from 'src/scope/scope'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import Liquid from 'src/liquid'

chai.use(sinonChai)
const expect = chai.expect
const liquid = new Liquid();

describe('tag', function () {
  let scope
  before(function () {
    scope = new Scope({
      foo: 'bar',
      arr: [2, 1],
      bar: {
        coo: 'uoo'
      }
    })
    Tag.clear()
  })

  it('should throw when not registered', function () {
    expect(function () {
      new Tag({ // eslint-disable-line
        type: 'tag',
        value: 'foo',
        name: 'foo'
      }, [], liquid)
    }).to.throw(/tag foo not found/)
  })

  it('should register simple tag', function () {
    expect(function () {
      Tag.register('foo', {
        render: x => 'bar'
      })
    }).not.throw()
  })

  it('should call tag.render', async function () {
    const spy = sinon.spy()
    Tag.register('foo', {
      render: spy
    })
    const token = {
      type: 'tag',
      value: 'foo',
      name: 'foo'
    }
    await new Tag(token, [], liquid).render(scope)
    expect(spy).to.have.been.called
  })

  describe('hash', function () {
    let spy, token
    beforeEach(function () {
      spy = sinon.spy()
      Tag.register('foo', {
        render: spy
      })
      token = {
        type: 'tag',
        value: 'foo aa:foo bb: arr[0] cc: 2.3\ndd:bar.coo',
        name: 'foo',
        args: 'aa:foo bb: arr[0] cc: 2.3\ndd:bar.coo'
      }
    })
    it('should call tag.render with scope', async function () {
      await new Tag(token, [], liquid).render(scope)
      expect(spy).to.have.been.calledWithMatch(scope)
    })
    it('should resolve identifier hash', async function () {
      await new Tag(token, [], liquid).render(scope)
      expect(spy).to.have.been.calledWithMatch({}, {
        aa: 'bar'
      })
    })
    it('should accept space between key/value', async function () {
      await new Tag(token, [], liquid).render(scope)
      expect(spy).to.have.been.calledWithMatch({}, {
        bb: 2
      })
    })
    it('should resolve number value hash', async function () {
      await new Tag(token, [], liquid).render(scope)
      expect(spy).to.have.been.calledWithMatch(scope, {
        cc: 2.3
      })
    })
    it('should resolve property access hash', async function () {
      await new Tag(token, [], liquid).render(scope)
      expect(spy).to.have.been.calledWithMatch(scope, {
        dd: 'uoo'
      })
    })
  })
})
