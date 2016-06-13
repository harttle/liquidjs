
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
                raw: htmlFragment,
                value: htmlFragment
            });
        }
        if(result[1]){
            tokens.push({
                type: 'tag',
                raw: result[1],
                value: result[2].trim()
            });
        }
        else{
            tokens.push({
                type: 'output',
                raw: result[3],
                value: result[4].trim()
            });
        }
        idx = syntax.lastIndex;
    }

    if(html.length > idx){
        htmlFragment = html.slice(idx, html.length);
        tokens.push({
            type: 'html',
            raw: htmlFragment,
            value: htmlFragment
        });
    }
    return tokens;
}

exports.parse = parse;
