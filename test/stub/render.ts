import { Liquid } from '../../src/liquid'
import { LiquidOptions } from '../../src/liquid-options'
import { expect } from 'chai'

export const liquid = new Liquid()

export function render (src: string, ctx?: object) {
  return liquid.parseAndRender(src, ctx)
}

export async function test (src: string, ctx: object | string, dst?: string, opts?: LiquidOptions) {
  if (dst === undefined) {
    dst = ctx as string
    ctx = {}
  }
  const engine = opts ? new Liquid(opts) : liquid
  return expect(await engine.parseAndRender(src, ctx as object)).to.equal(dst)
}
