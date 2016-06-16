const lexical = require('./lexical.js');
const syntax = require('./syntax.js');
const error = require('./error.js');

function stringify(val) {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

function isTruthy(val) {
    if (val instanceof Array) return !!val.length;
    return !!val;
}

function factory(Filter, Tag) {
    function renderTemplates(templates, scope) {
        var html = '';
        var template;
        while (template = templates.shift()) {
            if (template.type === 'tag') {
                html += template.render(scope);
            } else if (template.type === 'html') {
                html += template.value;
            } else if (template.type === 'output') {
                var val = evalFilter(template.value, scope);
                html += stringify(val);
            }
        }
        return html;
    }

    function evalExp(exp, scope) {
        if (!scope) error('unable to evalExp: scope undefined');
        var operatorREs = lexical.operators;
        for (var i = 0; i < operatorREs.length; i++) {
            var operatorRE = operatorREs[i];
            var expRE = new RegExp(`^(${lexical.quoteBalanced.source})(${operatorRE.source})(${lexical.quoteBalanced.source})$`);
            var match = exp.match(expRE);
            if (match) {
                var l = evalExp(match[1], scope);
                var op = syntax.operators[match[2].trim()];
                var r = evalExp(match[3], scope);
                return op(l, r);
            }
        }
        return evalFilter(exp, scope);
    }

    function evalFilter(str, scope) {
        if (!scope) error('unable to evalFilter: scope undefined');
        var filters = str.split('|');
        var val = scope.get(filters.shift());
        return filters
            .map(str => Filter.construct(str))
            .reduce((v, filter) => filter.render(v, scope), val);
    }

    return {
        renderTemplates, evalFilter, evalExp
    };
};

factory.isTruthy = isTruthy;
factory.stringify = stringify;

module.exports = factory;
