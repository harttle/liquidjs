import { Context } from '../context/context'

export function isTruthy (val: any, ctx: Context): boolean {
  return !isFalsy(val, ctx)
}

export function isFalsy (val: any, ctx: Context): boolean {
  if (ctx.opts.jsTruthy) {
    return !val
  } else {
    return val === false || undefined === val || val === null
  }
}
