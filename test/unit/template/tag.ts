import * as chai from 'chai'
import Tag from '../../../src/template/tag/tag'
import Context from '../../../src/context/context'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import Liquid from '../../../src/liquid'
import TagToken from '../../../src/parser/tag-token'

chai.use(sinonChai)
const expect = chai.expect
const liquid = new Liquid()

describe('tag', function () {
  let ctx: Context
  before(function () {
    ctx = new Context({
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
      } as TagToken, [], liquid)
    }).to.throw(/tag foo not found/)
  })

  it('should register simple tag', function () {
    expect(function () {
      Tag.register('foo', {
        render: () => 'bar'
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
    } as TagToken
    await new Tag(token, [], liquid).render(ctx)
    expect(spy).to.have.been.called
  })

  describe('hash', function () {
    let spy: sinon.SinonSpy, token: TagToken
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
      } as TagToken
    })
    it('should call tag.render with scope', async function () {
      await new Tag(token, [], liquid).render(ctx)
      expect(spy).to.have.been.calledWithMatch(ctx)
    })
    it('should resolve identifier hash', async function () {
      await new Tag(token, [], liquid).render(ctx)
      expect(spy).to.have.been.calledWithMatch({}, {
        aa: 'bar'
      })
    })
    it('should accept space between key/value', async function () {
      await new Tag(token, [], liquid).render(ctx)
      expect(spy).to.have.been.calledWithMatch({}, {
        bb: 2
      })
    })
    it('should resolve number value hash', async function () {
      await new Tag(token, [], liquid).render(ctx)
      expect(spy).to.have.been.calledWithMatch(ctx, {
        cc: 2.3
      })
    })
    it('should resolve property access hash', async function () {
      await new Tag(token, [], liquid).render(ctx)
      expect(spy).to.have.been.calledWithMatch(ctx, {
        dd: 'uoo'
      })
    })
  })
})
