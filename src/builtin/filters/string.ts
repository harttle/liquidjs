export default {
  'append': (v, arg) => v + arg,
  'prepend': (v, arg) => arg + v,
  'capitalize': str => String(str).charAt(0).toUpperCase() + str.slice(1),
  'concat': (v, arg) => Array.prototype.concat.call(v, arg),
  'lstrip': v => String(v).replace(/^\s+/, ''),
  'downcase': v => v.toLowerCase(),
  'upcase': str => String(str).toUpperCase(),
  'remove': (v, arg) => v.split(arg).join(''),
  'remove_first': (v, l) => v.replace(l, ''),
  'replace': (v, pattern, replacement) =>
    String(v).split(pattern).join(replacement),
  'replace_first': (v, arg1, arg2) => String(v).replace(arg1, arg2),
  'rstrip': str => String(str).replace(/\s+$/, ''),
  'split': (v, arg) => String(v).split(arg),
  'strip': (v) => String(v).trim(),
  'strip_newlines': v => String(v).replace(/\n/g, ''),
  'truncate': (v, l, o) => {
    v = String(v)
    o = (o === undefined) ? '...' : o
    l = l || 16
    if (v.length <= l) return v
    return v.substr(0, l - o.length) + o
  },
  'truncatewords': (v, l, o) => {
    if (o === undefined) o = '...'
    const arr = v.split(' ')
    let ret = arr.slice(0, l).join(' ')
    if (arr.length > l) ret += o
    return ret
  }
}
