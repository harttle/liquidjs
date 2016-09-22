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

            // for needs to execute the promises sequentially, not just resolve them sequentially, due to break and continue.
            // We can't just loop through executing everything then resolve them all sequentially like we do for render.renderTemplates
            // First, we build the array of parameters we are going to use for each call to renderTemplates
            var contexts = [];
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
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                contexts.push(ctx);
            });

            // This is some pretty tricksy javascript, at least to me.
            // This executes an array of promises sequentially for every argument in the contexts array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            // It's fundamentally equivalent to the following...
            //  emptyPromise.then(renderTemplates(args0).then(renderTemplates(args1).then(renderTemplates(args2)...
            var lastPromise = contexts.reduce((promise, context) => {
                return promise.then((partial) => {
                    if (scope.get('forloop.stop')) {
                        throw new Error('forloop.stop'); // this will stop the sequential promise chain
                    }

                    html += partial;
                    // todo: Make sure our scope management is sound here.  Create some tests that revolve around loops
                    //  with sections that take differing amounts of time to complete.  Make sure the order is maintained
                    //  and scope doesn't bleed over into other renderTemplate calls.
                    scope.push(context);
                    return liquid.renderer.renderTemplates(this.templates, scope);
                })
                .then((partial) => {
                    scope.pop(context);
                    return partial;
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

            return lastPromise
                .then(() => {
                    return html;
                })
                .catch((error) => {
                    throw new Error(error);
                });

        }
    });
};
