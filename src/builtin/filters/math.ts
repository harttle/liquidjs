import { caseInsensitiveCompare } from '../../util/underscore'

export const abs = Math.abs
export const atLeast = Math.max
export const atMost = Math.min
export const ceil = Math.ceil
export const dividedBy = (v: number, arg: number) => v / arg
export const floor = Math.floor
export const minus = (v: number, arg: number) => v - arg
export const modulo = (v: number, arg: number) => v % arg
export const times = (v: number, arg: number) => v * arg

export function round (v: number, arg = 0) {
  const amp = Math.pow(10, arg)
  return Math.round(v * amp) / amp
}

export function plus (v: number, arg: number) {
  return Number(v) + Number(arg)
}

export function sortNatural (input: any[], property?: string) {
  if (!input || !input.sort) return []
  if (property !== undefined) {
    return [...input].sort(
      (lhs, rhs) => caseInsensitiveCompare(lhs[property], rhs[property])
    )
  }
  return [...input].sort(caseInsensitiveCompare)
}
