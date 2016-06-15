const lexical = require('./lexical.js');
const syntax = require('./syntax.js');

module.exports = function(Filter, Tag) {
    function render(tokens, scope) {
        var html = '';
        while (tokens.length) {
            var token = tokens.shift();
            switch (token.type) {
                case 'html':
                    html += token.value;
                    break;
                case 'output':
                    html += evalFilter(token.value, scope);
                    break;
                case 'tag':
                    html += renderTag(token, tokens, scope);
                    break;
                default:
                    throw new Error(`unexpected type: ${token.type}`);
            }
        }
        return html;
    }

    function evalExp(exp, scope) {
        if(!scope) throw new Error('unable to evalExp: scope undefined');
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

    function evalFilter(str, scope){
        if(!scope) throw new Error('unable to evalFilter: scope undefined');
        var filters = str.split('|');
        var val = scope.get(filters.shift());
        return filters
            .map(str => Filter.construct(str))
            .reduce((v, filter) => filter.render(v, scope), val);
    }

    function renderTag(token, tokens, scope) {
        var tag = Tag.construct(token),
            subTokens = [];
        if (tag.needClose) {
            var curToken, endToken = 'end' + tag.token.name;
            while ((curToken = tokens.shift()) && curToken.value !== endToken) {
                subTokens.push(curToken);
            }
            if (!curToken) {
                throw new Error(`${token.value} not closed`);
            }
        }
        return tag.render(subTokens, scope);
    }

    return {
        render, renderTag, evalFilter, evalExp
    };
};
