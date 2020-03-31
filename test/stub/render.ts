import { Liquid } from '../../src/liquid'
import { expect } from 'chai'

export const liquid = new Liquid()

export function render (src: string, ctx?: object) {
  return liquid.parseAndRender(src, ctx)
}

export async function test (src: string, ctx: object | string, dst?: string) {
  if (dst === undefined) {
    dst = ctx as string
    ctx = {}
  }
  return expect(await render(src, ctx as object)).to.equal(dst)
}
