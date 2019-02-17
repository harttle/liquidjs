export default {
  'abs': v => Math.abs(v),
  'ceil': v => Math.ceil(v),
  'divided_by': (v, arg) => v / arg,
  'floor': v => Math.floor(v),
  'minus': bindFixed((v, arg) => v - arg),
  'modulo': bindFixed((v, arg) => v % arg),
  'round': (v, arg) => {
    const amp = Math.pow(10, arg || 0)
    return Math.round(v * amp) / amp
  },
  'plus': bindFixed((v, arg) => Number(v) + Number(arg)),
  'times': (v, arg) => v * arg
}

function getFixed (v) {
  const p = String(v).split('.')
  return (p.length > 1) ? p[1].length : 0
}

function bindFixed (cb) {
  return (l, r) => {
    const f = Math.max(getFixed(l), getFixed(r))
    return cb(l, r).toFixed(f)
  }
}
