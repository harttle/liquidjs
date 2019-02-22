export default {
  'abs': (v: number) => Math.abs(v),
  'ceil': (v: number) => Math.ceil(v),
  'divided_by': (v: number, arg: number) => v / arg,
  'floor': (v: number) => Math.floor(v),
  'minus': bindFixed((v: number, arg: number) => v - arg),
  'modulo': bindFixed((v: number, arg: number) => v % arg),
  'round': (v: number, arg: number = 0) => {
    const amp = Math.pow(10, arg)
    return Math.round(v * amp) / amp
  },
  'plus': bindFixed((v: number, arg: number) => Number(v) + Number(arg)),
  'times': (v: number, arg: number) => v * arg
}

function getFixed (v: number) {
  const p = String(v).split('.')
  return (p.length > 1) ? p[1].length : 0
}

function bindFixed (cb: (v: number, arg: number) => number) {
  return (l: number, r: number) => {
    const f = Math.max(getFixed(l), getFixed(r))
    return cb(l, r).toFixed(f)
  }
}
