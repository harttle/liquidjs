var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
    `(${lexical.value.source})` +
    `(?:\\s+${lexical.hash.source})*` +
    `(?:\\s+(reversed))?$`);

module.exports = function(liquid) {
    liquid.registerTag('for', {

        parse: function(tagToken, remainTokens) {
            var match = re.exec(tagToken.args);
            if (!match) throw new Error(`illegal tag: ${tagToken.raw}`);
            this.variable = match[1];
            this.collection = match[2];
            this.reversed = !!match[3];

            this.templates = [];
            this.elseTemplates = [];

            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('start', x => p = this.templates)
                .on('tag:else', token => p = this.elseTemplates)
                .on('tag:endfor', token => stream.stop())
                .on('template', tpl => p.push(tpl))
                .on('end', x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            var collection = Liquid.evalExp(this.collection, scope);
            if (Liquid.isFalsy(collection)) {
                return liquid.renderer.renderTemplates(this.elseTemplates, scope);
            }

            var html = '',
                ctx = {},
                length = collection.length;
            var offset = hash.offset || 0;
            var limit = (hash.limit === undefined) ? collection.length : hash.limit;

            collection = collection.slice(offset, offset + limit);
            if(this.reversed) collection.reverse();
            collection.some((item, i) => {
                ctx[this.variable] = item;
                ctx.forloop = {
                    first: i === 0,
                    index: i + 1,
                    index0: i,
                    last: i === length - 1,
                    length: length,
                    rindex: length - i,
                    rindex0: length - i - 1,
                    stop: false,
                    skip: false
                };
                scope.push(ctx);
                html += liquid.renderer.renderTemplates(this.templates, scope);
                var breakloop = scope.get('forloop.stop');
                scope.pop(ctx);

                if (breakloop) return true;
            });
            return html;
        }
    });
};
