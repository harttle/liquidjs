const lexical = require('./lexical.js');
const TokenizationError = require('./error.js').TokenizationError;
const _ = require('./util/underscore.js');

function parse(html) {
    var tokens = [];
    if (!_.isString(html)) {
        throw new TokenizationError('illegal input type');
    }

    var syntax = /({%(.*?)%})|({{(.*?)}})/g;
    var result, htmlFragment, token;
    var lastMatchEnd = 0, lastMatchBegin = -1, parsedLinesCount = 0;

    while ((result = syntax.exec(html)) !== null) {
        // passed html fragments
        if (result.index > lastMatchEnd) {
            htmlFragment = html.slice(lastMatchEnd, result.index);
            tokens.push({
                type: 'html',
                raw: htmlFragment,
                value: htmlFragment
            });
        }
        // tag appeared
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
        }
        // output
        else {
            token = factory('output', 3, result);
            tokens.push(token);
        }
        lastMatchEnd = syntax.lastIndex;
    }

    // remaining html
    if (html.length > lastMatchEnd) {
        htmlFragment = html.slice(lastMatchEnd, html.length);
        tokens.push({
            type: 'html',
            raw: htmlFragment,
            value: htmlFragment
        });
    }
    return tokens;

    function factory(type, offset, match) {
        return {
            type: type,
            raw: match[offset],
            value: match[offset + 1].trim(),
            line: getLineNum(match),
            input: getLineContent(match)
        };
    }

    function getLineContent(match) {
        var idx1 = match.input.lastIndexOf('\n', match.index);
        var idx2 = match.input.indexOf('\n', match.index);
        if (idx2 === -1) idx2 = match.input.length;
        return match.input.slice(idx1 + 1, idx2);
    }

    function getLineNum(match) {
        var lines = match.input.slice(lastMatchBegin + 1, match.index).split('\n');
        parsedLinesCount += lines.length - 1;
        lastMatchBegin = match.index;
        return parsedLinesCount + 1;
    }
}

exports.parse = parse;
