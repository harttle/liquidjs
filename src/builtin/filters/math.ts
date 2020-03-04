import { caseInsensitiveCompare } from '../../util/underscore'

export default {
  'abs': (v: number) => Math.abs(v),
  'at_least': (v: number, n: number) => Math.max(v, n),
  'at_most': (v: number, n: number) => Math.min(v, n),
  'ceil': (v: number) => Math.ceil(v),
  'divided_by': (v: number, arg: number) => v / arg,
  'floor': (v: number) => Math.floor(v),
  'minus': (v: number, arg: number) => v - arg,
  'modulo': (v: number, arg: number) => v % arg,
  'round': (v: number, arg = 0) => {
    const amp = Math.pow(10, arg)
    return Math.round(v * amp) / amp
  },
  'plus': (v: number, arg: number) => Number(v) + Number(arg),
  'sort_natural': sortNatural,
  'times': (v: number, arg: number) => v * arg
}

function sortNatural (input: any[], property?: string) {
  if (!input || !input.sort) return []
  if (property !== undefined) {
    return [...input].sort(
      (lhs, rhs) => caseInsensitiveCompare(lhs[property], rhs[property])
    )
  }
  return [...input].sort(caseInsensitiveCompare)
}
