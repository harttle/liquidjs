export default {
  'abs': (v: number) => Math.abs(v),
  'ceil': (v: number) => Math.ceil(v),
  'divided_by': (v: number, arg: number) => v / arg,
  'floor': (v: number) => Math.floor(v),
  'minus': (v: number, arg: number) => v - arg,
  'modulo': (v: number, arg: number) => v % arg,
  'round': (v: number, arg: number = 0) => {
    const amp = Math.pow(10, arg)
    return Math.round(v * amp) / amp
  },
  'plus': (v: number, arg: number) => Number(v) + Number(arg),
  'times': (v: number, arg: number) => v * arg
}
