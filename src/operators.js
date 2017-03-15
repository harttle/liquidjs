var operators = {
    '==': (l, r) => l == r,
    '!=': (l, r) => l != r,
    '>': (l, r) => l > r,
    '<': (l, r) => l < r,
    '>=': (l, r) => l >= r,
    '<=': (l, r) => l <= r,
    'contains': (l, r) => typeof l === 'string' ? l.indexOf(r) > -1 : false,
    'and': (l, r) => l && r,
    'or': (l, r) => l || r
};

module.exports = operators;
