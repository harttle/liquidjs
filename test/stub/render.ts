import Liquid from '../../src/liquid'
import { expect } from 'chai'

export const liquid = new Liquid()

export const ctx = {
  date: new Date(),
  foo: 'bar',
  arr: [-2, 'a'],
  obj: { foo: 'bar' },
  func: function () {},
  posts: [{ category: 'foo' }, { category: 'bar' }],
  products: [
    { title: 'Vacuum', type: 'living room' },
    { title: 'Spatula', type: 'kitchen' },
    { title: 'Television', type: 'living room' },
    { title: 'Garlic press', type: 'kitchen' },
    { title: 'Coffee mug', available: true },
    { title: 'Limited edition sneakers', available: false },
    { title: 'Boring sneakers', available: true }
  ]
}

export async function test (src: string, dst: string) {
  const html = await liquid.parseAndRender(src, ctx)
  return expect(html).to.equal(dst)
}
