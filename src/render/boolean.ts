import { Context } from '../context/context'

export function isTruthy (val: any, ctx: Context): boolean {
  if ((val === null) && ctx && ctx.opts && ctx.opts.jsTruthy ) return false;
  return !isFalsy(val, ctx)
}

export function isFalsy (val: any, ctx: Context): boolean {
  if(ctx && ctx.opts && ctx.opts.jsTruthy) {
    return val == false
  }
  else {
    return val === false || undefined === val || val === null
  }
}
