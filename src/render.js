const error = require('./error.js');
const Exp = require('./expression.js');
const assert = require('assert');
const Promise = require('any-promise');

var render = {

    renderTemplates: function(templates, scope) {
        assert(scope, 'unable to evalTemplates: scope undefined');

        var html = '';

        // This executes an array of promises sequentially for every template in the templates array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
        // It's fundamentally equivalent to the following...
        //  emptyPromise.then(renderTag(template0).then(renderTag(template1).then(renderTag(template2)...
        var lastPromise = templates.reduce((promise, template) => {
            return promise.then((partial) => {
                if (scope.get('forloop.skip')) {
                    return Promise.resolve('');
                }
                if (scope.get('forloop.stop')) {
                    throw new Error('forloop.stop'); // this will stop/break the sequential promise chain and go to the catch
                }

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
                        var val = this.evalOutput(template, scope);
                        promiseLink = Promise.resolve(val === undefined ? '' : stringify(val))
                            .then((partial) => {
                                return html += partial;
                            });
                        break;
                }

                return promiseLink;
            })
            .catch((error) => {
                if (error.message === 'forloop.skip') {
                    // the error is a controlled, purposeful stop. so just return the html that we have up to this point
                    return html;
                } else {
                    // rethrow actual error
                    throw error;
                }
            });
        }, Promise.resolve(''));  // start the reduce chain with a resolved Promise. After first run, the "promise" argument
        //  in our reduce callback will be the returned promise from our "then" above.  In this
        //  case, that's the promise returned from this.renderTag or a resolved promise with raw html.

        return lastPromise
            .then((renderedHtml) => {
                return renderedHtml;
            })
            .catch((error) => {
                throw error;
            });

    },

    renderTag: function(template, scope, register) {
        if (template.name === 'continue') {
            scope.set('forloop.skip', true);
            return Promise.resolve('');
        }
        if (template.name === 'break') {
            scope.set('forloop.stop', true);
            scope.set('forloop.skip', true);
            return Promise.reject(new Error('forloop.stop')); // this will stop the sequential promise chain
        }
        return template.render(scope, register);
    },

    evalOutput: function(template, scope) {
        assert(scope, 'unable to evalOutput: scope undefined');
        var val = Exp.evalExp(template.initial, scope);
        return template.filters
            .reduce((v, filter) => filter.render(v, scope), val);
    },

    resetRegisters: function(){
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
