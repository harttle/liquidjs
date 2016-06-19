var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
    `(${lexical.value.source})` +
    `(?:\\s+${lexical.hash.source})*$`);

module.exports = function(liquid) {
    liquid.registerTag('tablerow', {

        parse: function(tagToken, remainTokens) {
            var match = re.exec(tagToken.args);
            if (!match) throw new Error(`illegal tag: ${tagToken.raw}`);
            this.variable = match[1];
            this.collection = match[2];

            this.templates = [];

            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('start', x => p = this.templates)
                .on('tag:endtablerow', token => stream.stop())
                .on('template', tpl => p.push(tpl))
                .on('end', x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            var collection = Liquid.evalExp(this.collection, scope) || [];

            var html = '<table>',
                ctx = {},
                length = collection.length;
            var offset = hash.offset || 0;
            var limit = (hash.limit === undefined) ? collection.length : hash.limit;

            var cols = hash.cols, row, col;
            if (!cols) throw new Error(`illegal cols: ${cols}`);

            collection.slice(offset, offset + limit).some((item, i) => {
                row = Math.floor(i / cols) + 1;
                col = (i % cols) + 1;
                if(col === 1){
                    if(row !== 1){
                        html += '</tr>';
                    }
                    html += `<tr class="row${row}">`;
                }

                ctx[this.variable] = item;
                scope.push(ctx);
                html += `<td class="col${col}">`;
                html += liquid.renderer.renderTemplates(this.templates, scope);
                html += '</td>';
                scope.pop(ctx);
            });
            if(row > 0) html += '</tr>';
            html += '</table>';
            return html;
        }
    });
};
