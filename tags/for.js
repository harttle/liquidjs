const Liquid = require('..');
const lexical = Liquid.lexical;
const mapSeries = require('../src/util/promise.js').mapSeries;
const RenderBreakError = Liquid.Types.RenderBreakError;
const assert = require('../src/util/assert.js');
const re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
    `(${lexical.value.source})` +
    `(?:\\s+${lexical.hash.source})*` +
    `(?:\\s+(reversed))?$`);

module.exports = function(liquid) {
    liquid.registerTag('for', {

        parse: function(tagToken, remainTokens) {
            var match = re.exec(tagToken.args);
            assert(match, `illegal tag: ${tagToken.raw}`);
            this.variable = match[1];
            this.collection = match[2];
            this.reversed = !!match[3];

            this.templates = [];
            this.elseTemplates = [];

            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('start', () => p = this.templates)
                .on('tag:else', () => p = this.elseTemplates)
                .on('tag:endfor', () => stream.stop())
                .on('template', tpl => p.push(tpl))
                .on('end', () => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            var collection = Liquid.evalExp(this.collection, scope);
            if (Liquid.isFalsy(collection)) {
                return liquid.renderer.renderTemplates(this.elseTemplates, scope);
            }

            var length = collection.length;
            var offset = hash.offset || 0;
            var limit = (hash.limit === undefined) ? collection.length : hash.limit;

            collection = collection.slice(offset, offset + limit);
            if (this.reversed) collection.reverse();

            var contexts = collection.map((item, i) => {
                var ctx = {};
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
                return ctx;
            });

            var html = '';
            return mapSeries(contexts, (context) => {
                scope.push(context);
                return liquid.renderer
                    .renderTemplates(this.templates, scope)
                    .then(partial => html += partial)
                    .catch(e => {
                        if (e instanceof RenderBreakError) {
                            html += e.resolvedHTML;
                            if (e.message === 'continue') return;
                        }
                        throw e;
                    })
                    .then(() => scope.pop());
            }).catch((e) => {
                if (e instanceof RenderBreakError && e.message === 'break') {
                    return;
                }
                throw e;
            }).then(() => html);
        }
    });
};
