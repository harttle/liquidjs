const lexical = require('./lexical.js');
const TokenizationError = require('./error.js').TokenizationError;

function parse(html) {
    var tokens = [];
    if (!html) return tokens;

    var syntax = /({%(.*?)%})|({{(.*?)}})/g;
    var result, htmlFragment, token;
    var idx = 0;
    var _idx = -1;
    var _count = 0;

    while ((result = syntax.exec(html)) !== null) {
        if (result.index > idx) {
            htmlFragment = html.slice(idx, result.index);
            tokens.push({
                type: 'html',
                value: htmlFragment
            });
        }

        if (result[1]) {
            token = factory('tag', 1, result);
            var match = token.value.match(lexical.tagLine);
            if (!match) {
                throw new TokenizationError(`illegal tag: ${token.raw}`,
                    token.input, token.line);
            }

            token.name = match[1];
            token.args = match[2];
            tokens.push(token);
        } else {
            token = factory('output', 3, result);
            tokens.push(token);
        }
        idx = syntax.lastIndex;
    }

    if (html.length > idx) {
        htmlFragment = html.slice(idx, html.length);
        tokens.push({
            type: 'html',
            value: htmlFragment
        });
    }
    return tokens;

    function factory(type, offset, match) {

        var lines = match.input.slice(_idx + 1, match.index).split('\n');
        var idx1 = match.input.lastIndexOf('\n', match.index);
        var idx2 = match.input.indexOf('\n', match.index);
        if(idx2 === -1) idx2 = match.input.length;
        var input = match.input.slice(idx1 + 1, idx2);
        _count += lines.length - 1;
        _idx = match.index;

        var token = {
            type: type,
            raw: match[offset],
            value: match[offset + 1].trim(),
            line: _count + 1,
            input: input
        };
        return token;
    }

}

exports.parse = parse;
