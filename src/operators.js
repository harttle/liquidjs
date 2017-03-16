var operators = {
    '==': (l, r) => l == r,
    '!=': (l, r) => l != r,
    '>': (l, r) => l > r,
    '<': (l, r) => l < r,
    '>=': (l, r) => l >= r,
    '<=': (l, r) => l <= r,
	'contains': (l, r) => {
        return typeof l !== 'undefined' 
            ? typeof l.indexOf === 'function' 
                ? l.indexOf(r) > -1 
                : false 
            : false;
    },
    'and': (l, r) => l && r,
    'or': (l, r) => l || r
};

module.exports = operators;
