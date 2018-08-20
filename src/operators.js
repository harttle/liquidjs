export default function (isTruthy) {
  return {
    '==': (l, r) => l === r,
    '!=': (l, r) => l !== r,
    '>': (l, r) => l !== null && r !== null && l > r,
    '<': (l, r) => l !== null && r !== null && l < r,
    '>=': (l, r) => l !== null && r !== null && l >= r,
    '<=': (l, r) => l !== null && r !== null && l <= r,
    'contains': (l, r) => {
      if (!l) return false
      if (typeof l.indexOf !== 'function') return false
      return l.indexOf(r) > -1
    },
    'and': (l, r) => isTruthy(l) && isTruthy(r),
    'or': (l, r) => isTruthy(l) || isTruthy(r)
  }
}
