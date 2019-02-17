import { last } from 'src/util/underscore'

export default {
  'join': (v, arg) => v.join(arg === undefined ? ' ' : arg),
  'last': v => last(v),
  'first': v => v[0],
  'map': (arr, arg) => arr.map(v => v[arg]),
  'reverse': v => v.reverse(),
  'sort': (v, arg) => v.sort(arg),
  'size': v => v.length,
  'slice': (v, begin, length) => {
    if (length === undefined) length = 1
    return v.slice(begin, begin + length)
  },
  'uniq': function (arr) {
    const u = {}
    return (arr || []).filter(val => {
      if (u.hasOwnProperty(val)) {
        return false
      }
      u[val] = true
      return true
    })
  }
}
