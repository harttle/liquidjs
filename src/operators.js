var operators = {
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
  'and': (l, r) => l && r,
  'or': (l, r) => l || r
}

module.exports = operators
