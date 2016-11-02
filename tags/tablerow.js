const Liquid = require('..');
const Promise = require('any-promise');
const lexical = Liquid.lexical;
const assert = require('../src/util/assert.js');
const re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+` +
    `(${lexical.value.source})` +
    `(?:\\s+${lexical.hash.source})*$`);

module.exports = function(liquid) {
    liquid.registerTag('tablerow', {

        parse: function(tagToken, remainTokens) {
            var match = re.exec(tagToken.args);
            assert(match, `illegal tag: ${tagToken.raw}`);
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

            var html = '<table>';
            var offset = hash.offset || 0;
            var limit = (hash.limit === undefined) ? collection.length : hash.limit;

            var cols = hash.cols, row, col;
            if (!cols) throw new Error(`illegal cols: ${cols}`);

            // build array of arguments to pass to sequential promises...
            collection = collection.slice(offset, offset + limit);
            var contexts = [];
            collection.some((item, i) => {
                var ctx = {};
                ctx[this.variable] = item;
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                contexts.push(ctx);
            });

            // This executes an array of promises sequentially for every argument in the contexts array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            // It's fundamentally equivalent to the following...
            //  emptyPromise.then(renderTemplates(args0).then(renderTemplates(args1).then(renderTemplates(args2)...
            var lastPromise = contexts.reduce((promise, context, currentIndex) => {
                return promise.then((partial) => {
                    row = Math.floor(currentIndex / cols) + 1;
                    col = (currentIndex % cols) + 1;
                    if(col === 1) {
                        if(row !== 1){
                            html += '</tr>';
                        }
                        html += `<tr class="row${row}">`;
                    }

                    //ctx[this.variable] = context;

                    return html += `<td class="col${col}">`;
                })
                .then((partial) => {
                    scope.push(context);
                    return liquid.renderer.renderTemplates(this.templates, scope)
                })
                .then((partial) => {
                    scope.pop(context);
                    html += partial;
                    return html += '</td>';
                });
            }, Promise.resolve(''));    // start the reduce chain with a resolved Promise. After first run, the "promise" argument
                                        //  in our reduce callback will be the returned promise from our "then" above.  In this
                                        //  case, the promise returned from liquid.renderer.renderTemplates.

            return lastPromise
                .then(() => {
                    if(row > 0) {
                        html += '</tr>';
                    }
                    html += '</table>';
                    return html;
                })
                .catch((error) => {
                    throw error;
                });
        }
    });
};
