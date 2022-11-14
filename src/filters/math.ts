import { toValue, argumentsToValue } from '../util/underscore'

export const abs = argumentsToValue(Math.abs)
export const at_least = argumentsToValue(Math.max)
export const at_most = argumentsToValue(Math.min)
export const ceil = argumentsToValue(Math.ceil)
export const divided_by = argumentsToValue((dividend: number, divisor: number, integerArithmetic = false) => integerArithmetic ? Math.floor(dividend / divisor) : dividend / divisor)
export const floor = argumentsToValue(Math.floor)
export const minus = argumentsToValue((v: number, arg: number) => v - arg)
export const modulo = argumentsToValue((v: number, arg: number) => v % arg)
export const times = argumentsToValue((v: number, arg: number) => v * arg)

export function round (v: number, arg = 0) {
  v = toValue(v)
  arg = toValue(arg)
  const amp = Math.pow(10, arg)
  return Math.round(v * amp) / amp
}

export function plus (v: number, arg: number) {
  v = toValue(v)
  arg = toValue(arg)
  return Number(v) + Number(arg)
}
