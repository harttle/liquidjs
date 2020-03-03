import * as chai from 'chai'
import { Tag } from '../../../src/template/tag/tag'
import { Context } from '../../../src/context/context'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Liquid } from '../../../src/liquid'
import { TagToken } from '../../../src/parser/tag-token'
import { toThenable } from '../../../src/util/async'

chai.use(sinonChai)
const expect = chai.expect

describe('Tag', function () {
  let ctx: Context
  let liquid: Liquid
  const emitter: any = { write: (html: string) => (emitter.html += html), html: '' }
  before(function () {
    ctx = new Context({
      foo: 'bar',
      arr: [2, 1],
      bar: {
        coo: 'uoo'
      }
    })
    liquid = new Liquid()
  })
  beforeEach(function () {
    emitter.html = ''
  })

  it('should throw when not registered', function () {
    expect(function () {
      new Tag({ // eslint-disable-line
        type: 'tag',
        content: 'foo',
        args: '',
        name: 'not-exist'
      } as TagToken, [], liquid)
    }).to.throw(/tag "not-exist" not found/)
  })

  it('should register simple tag', function () {
    expect(function () {
      liquid.registerTag('foo', { render: () => 'bar' })
    }).not.throw()
  })

  it('should call tag.render', async function () {
    const spy = sinon.spy()
    liquid.registerTag('foo', { render: spy })
    const token = {
      type: 'tag',
      content: 'foo',
      args: '',
      name: 'foo'
    } as TagToken
    await toThenable(new Tag(token, [], liquid).render(ctx, emitter))
    expect(spy).to.have.been.called
  })
})
