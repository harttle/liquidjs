var operators = {
    '==': (l, r) => l == r,
    '!=': (l, r) => l != r,
    '>': (l, r) => l > r,
    '<': (l, r) => l < r,
    '>=': (l, r) => l >= r,
    '<=': (l, r) => l <= r,
    'contains': (l, r) => l.indexOf(r) > -1,
    'and': (l, r) => l && r,
    'or': (l, r) => l || r
};

module.exports = operators;
