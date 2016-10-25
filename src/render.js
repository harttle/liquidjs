const Syntax = require('./syntax.js');
const Promise = require('any-promise');

var render = {

    renderTemplates: function(templates, scope, opts) {
        if (!scope) throw new Error('unable to evalTemplates: scope undefined');
        opts = opts || {};
        opts.strict_filters = opts.strict_filters || false;

        var html = '';

        // This executes an array of promises sequentially for every template in the templates array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
        // It's fundamentally equivalent to the following...
        //  emptyPromise.then(renderTag(template0).then(renderTag(template1).then(renderTag(template2)...
        var lastPromise = templates.reduce((promise, template) => {
            return promise.then(() => {
                var promiseLink = Promise.resolve('');
                switch (template.type) {
                    case 'tag':
                        // Add Promises to the chain
                        promiseLink = this.renderTag(template, scope, this.register)
                            .then((partial) => {
                                if (partial === undefined) {
                                    return true; // basically a noop (do nothing)
                                }
                                return html += partial;
                            });
                        break;
                    case 'html':
                        promiseLink = Promise.resolve(template.value)
                            .then((partial) => {
                                return html += partial;
                            });
                        break;
                    case 'output':
                        var val = this.evalOutput(template, scope, opts);
                        promiseLink = Promise.resolve(val === undefined ? '' : stringify(val))
                            .then((partial) => {
                                return html += partial;
                            });
                        break;
                }

                return promiseLink;
            });
        }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
        //  in our reduce callback will be the returned promise from our "then" above.  In this
        //  case, that's the promise returned from this.renderTag or a resolved promise with raw html.

        return lastPromise;
    },

    renderTag: function(template, scope, register) {
        if (template.name === 'continue') {
            return Promise.resolve('');
        }
        if (template.name === 'break') {
            return Promise.reject(new Error('forloop.stop')); // this will stop the sequential promise chain
        }
        return template.render(scope, register);
    },

    evalOutput: function(template, scope, opts) {
        if (!scope) throw new Error('unable to evalOutput: scope undefined');
        var val = Syntax.evalExp(template.initial, scope);
        template.filters.some(filter => {
            if (filter.error) {
                if (opts.strict_filters) {
                    throw filter.error;
                } else { // render as null
                    val = '';
                    return true;
                }
            }
            val = filter.render(val, scope);
        });
        return val;
    },

    resetRegisters: function() {
        return this.register = {};
    }
};

function factory() {
    var instance = Object.create(render);
    instance.register = {};
    return instance;
}

function stringify(val) {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

module.exports = factory;
