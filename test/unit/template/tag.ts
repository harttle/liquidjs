import * as chai from 'chai'
import { Tag } from '../../../src/template/tag/tag'
import { Context } from '../../../src/context/context'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { TagToken } from '../../../src/tokens/tag-token'
import { toThenable } from '../../../src/util/async'

chai.use(sinonChai)
const expect = chai.expect

describe('Tag', function () {
  const ctx = new Context()
  const emitter: any = { write: (html: string) => (emitter.html += html), html: '' }

  it('should call tag.render', async function () {
    const spy = sinon.spy()
    const token = {
      content: 'foo',
      args: '',
      name: 'foo'
    } as TagToken
    await toThenable(new Tag(token, [], {
      tags: {
        get: () => ({ render: spy })
      }
    } as any).render(ctx, emitter))
    expect(spy).to.have.been.called
  })
})
