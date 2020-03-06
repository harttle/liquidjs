import { expect } from 'chai'
import { TagMap } from '../../../src/template/tag/tag-map'

describe('TagMap', function () {
  it('should throw when not exist', function () {
    const map = new TagMap()
    expect(() => map.get('not-exist'))
      .to.throw(/tag "not-exist" not found/)
  })
  it('should get previously set value', function () {
    const map = new TagMap()
    const impl = { render: () => 'foo' }
    map.set('foo', impl)
    expect(map.get('foo')).to.equal(impl)
  })
})
