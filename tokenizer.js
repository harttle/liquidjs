const lexical = require('./lexical.js');
const error = require('./error.js');

function parse(html){
    var tokens = [];
    if(!html) return tokens;

    var syntax = /({%(.*?)%})|({{(.*?)}})/g;
    var result, htmlFragment, token;
    var idx = 0;

    while ((result = syntax.exec(html)) !== null) {
        if(result.index > idx){
            htmlFragment = html.slice(idx, result.index);
            tokens.push({
                type: 'html',
                value: htmlFragment
            });
        }

        if(result[1]){
            token = factory('tag', 1, result);
            var match = token.value.match(lexical.tagLine);
            if (!match) error('illegal tag', token);

            token.name = match[1];
            token.args = match[2];
            tokens.push(token);
        }
        else{
            token = factory('output', 3, result);
            tokens.push(token);
        }
        idx = syntax.lastIndex;
    }

    if(html.length > idx){
        htmlFragment = html.slice(idx, html.length);
        tokens.push({
            type: 'html',
            value: htmlFragment
        });
    }
    return tokens;

    function factory(type, offset, match){
        var token = {
            type,
            raw: match[offset],
            value: match[offset + 1].trim(),
            line: crCount(match.index) + 1
        };
        return token;
    }

    var lastIdx = -1;
    var lastCount = 0;
    function crCount(idx){
        lastCount += html.slice(lastIdx+1, idx);
        lastIdx = idx;
        return lastCount;
    }
}

exports.parse = parse;
