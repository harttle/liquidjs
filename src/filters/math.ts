import { toNumber, argumentsToNumber } from '../util/underscore'

export const abs = argumentsToNumber(Math.abs)
export const at_least = argumentsToNumber(Math.max)
export const at_most = argumentsToNumber(Math.min)
export const ceil = argumentsToNumber(Math.ceil)
export const divided_by = argumentsToNumber((dividend: number, divisor: number, integerArithmetic = false) => integerArithmetic ? Math.floor(dividend / divisor) : dividend / divisor)
export const floor = argumentsToNumber(Math.floor)
export const minus = argumentsToNumber((v: number, arg: number) => v - arg)
export const plus = argumentsToNumber((lhs: number, rhs: number) => lhs + rhs)
export const modulo = argumentsToNumber((v: number, arg: number) => v % arg)
export const times = argumentsToNumber((v: number, arg: number) => v * arg)

export function round (v: number, arg = 0) {
  v = toNumber(v)
  arg = toNumber(arg)
  const amp = Math.pow(10, arg)
  return Math.round(v * amp) / amp
}
