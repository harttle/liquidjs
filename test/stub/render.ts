import { Liquid } from '../../src/liquid'
import { LiquidOptions } from '../../src/liquid-options'
import { expect } from 'chai'

export const liquid = new Liquid()

export function render (src: string, ctx?: object, opts?: LiquidOptions) {
  return liquid.parseAndRender(src, ctx, opts)
}

export async function test (src: string, ctx: object | string, dst?: string, opts?: LiquidOptions) {
  if (dst === undefined) {
    dst = ctx as string
    ctx = {}
  }
  return expect(await render(src, ctx as object, opts)).to.equal(dst)
}
