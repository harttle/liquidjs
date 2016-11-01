const Liquid = require('..');
const Promise = require('any-promise');
const lexical = Liquid.lexical;
const mapSeries = require('../src/util/promise.js').mapSeries;
const RenderBreak = Liquid.Types.RenderBreak;
const re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
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
                        if (e instanceof RenderBreak) {
                            html += e.resolvedHTML;
                            if (e.message === 'continue') return;
                        }
                        throw e;
                    })
                    .then(() => scope.pop());
            }).catch((e) => {
                if (e instanceof RenderBreak && e.message === 'break') {
                    return;
                }
                throw e;
            }).then(() => html);
        }
    });
};
