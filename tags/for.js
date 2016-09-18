var Liquid = require('..');
var Promise = require('any-promise');
var _ = require('lodash');
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

            var scopes = [];
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
                // todo: verify scope management is good here.  Make sure we don't consume too many resources here with the clone.
                //  Is there a simpler solution?
                scope.push(ctx);
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                scopes.push(_.clone(scope));
                scope.pop(ctx);
            });

            // This is some pretty tricksy javascript, at least to me.  Bluebird would have made this a lot easier, but
            //  we are trying to not use anything that can't be done in native node Promises.
            // This basically just processes an array of promises sequentially for every argument in the array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            var lastPromise = scopes.reduce((promise, scope) => {
                return promise.then(function(partial) {
                    var breakloop = scope.get('forloop.stop');
                    if (breakloop)
                        throw new Error('forloop.stop'); // this will stop the sequential promise chain

                    html += partial;
                    return liquid.renderer.renderTemplates(this.templates, scope);
                })
                .catch((error) => {
                    if (error === 'forloop.stop') {
                        // the error is a controlled, purposeful stop. so just return the html that we have up to this point
                        return html;
                    } else {
                        // rethrow actual error
                        throw new Error(error);
                    }
                });
            }, Promise.resolve());  // start the reduce chain with a resolved Promise. After first run, the "promise" argument
                                    //  in our reduce callback will be the returned promise from our "then" above.  In this
                                    //  case, the promise returned from liquid.renderer.renderTemplates.

            lastPromise
                .then(() => {
                    return Promise.resolve(html);
                })
                .catch((error) => {
                    throw new Error(error);
                });

        }
    });
};
