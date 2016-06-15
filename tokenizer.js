const lexical = require('./lexical.js');

function parse(html){
    var tokens = [];
    if(!html) return tokens;

    var syntax = /({%(.*?)%})|({{(.*?)}})/g;
    var result, htmlFragment;
    var idx = 0;

    while ((result = syntax.exec(html)) !== null) {
        if(result.index > idx){
            htmlFragment = html.slice(idx, result.index);
            tokens.push({
                type: 'html',
                value: htmlFragment
            });
        }
        var rawTag = result[1],
            cleanTag = result[2],
            rawOut = result[3],
            cleanOut = result[4];

        if(rawTag){
            var match = cleanTag.trim().match(lexical.tagLine);
            if (!match) throw new Error('illegal tag: ' + rawTag);
            var name = match[1], args = match[2];

            tokens.push({
                type: 'tag',
                value: cleanTag.trim(),
                raw: rawTag,
                args, name
            });
        }
        else{
            tokens.push({
                type: 'output',
                raw: rawOut,
                value: cleanOut.trim()
            });
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
}

exports.parse = parse;
