const Filter = require('./filter');
const Tag = require('./tag');

module.exports = function render(tokens, ctx) {
    var html = '';
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens.shift();
        switch (token.type) {
            case 'html':
                html += token.value;
                break;
            case 'output':
                html += renderOutput(token);
                break;
            case 'tag':
                html += renderTag(token);
                break;
            default:
                throw new Error(`unexpected type: ${token.type}`);
        }
    }
    return html;

    function renderOutput(token) {
        var filters = token.value.split('|');
        var val = ctx.get(filters.shift());
        return filters
            .map(str => Filter.parse(str))
            .reduce((v, filter) => filter.render(v, ctx), val);
    }

    function renderTag(token) {
        var tag = Tag.parse(token.value), subTokens = [];
        if(tag.needClose){
            var curToken, endToken = 'end' + tag.name;
            while((curToken = tokens.shift()).value !== endToken){
                subTokens.push(curToken);
            }
            if(curToken.value !== endToken){
                throw new Error(`${token.value} not closed`);
            }
        }
        return tag.render(subTokens, ctx);
    }
};

