import { Context } from '../context/context'
import { toValue } from '../util'

export function isTruthy (val: any, ctx: Context): boolean {
  return !isFalsy(val, ctx)
}

export function isFalsy (val: any, ctx: Context): boolean {
  val = toValue(val)

  if (ctx.opts.jsTruthy) {
    return !val
  } else {
    return val === false || undefined === val || val === null
  }
}
