export default {
  'append': (v: string, arg: string) => v + arg,
  'prepend': (v: string, arg: string) => arg + v,
  'capitalize': (str: string) => String(str).charAt(0).toUpperCase() + str.slice(1),
  'lstrip': (v: string) => String(v).replace(/^\s+/, ''),
  'downcase': (v: string) => v.toLowerCase(),
  'upcase': (str: string) => String(str).toUpperCase(),
  'remove': (v: string, arg: string) => v.split(arg).join(''),
  'remove_first': (v: string, l: string) => v.replace(l, ''),
  'replace': (v: string, pattern: string, replacement: string) =>
    String(v).split(pattern).join(replacement),
  'replace_first': (v: string, arg1: string, arg2: string) => String(v).replace(arg1, arg2),
  'rstrip': (str: string) => String(str).replace(/\s+$/, ''),
  'split': (v: string, arg: string) => String(v).split(arg),
  'strip': (v: string) => String(v).trim(),
  'strip_newlines': (v: string) => String(v).replace(/\n/g, ''),
  'truncate': (v: string, l: number = 50, o: string = '...') => {
    v = String(v)
    if (v.length <= l) return v
    return v.substr(0, l - o.length) + o
  },
  'truncatewords': (v: string, l: number = 15, o: string = '...') => {
    const arr = v.split(/\s+/)
    let ret = arr.slice(0, l).join(' ')
    if (arr.length >= l) ret += o
    return ret
  }
}
