const error = require('./error.js');
const Exp = require('./expression.js');
const assert = require('assert');
const Promise = require('any-promise');

var render = {

    renderTemplates: function(templates, scope) {
        assert(scope, 'unable to evalTemplates: scope undefined');
        var htmlBlocks = [],
            partial,
            promises = [];
        templates.some((template, index) => {
            if (scope.get('forloop.skip')) return true;
            switch (template.type) {
                case 'tag':
                    promises.push(this.renderTag(template, scope, this.register)
                        .then((partial) => {
                            if (partial === undefined) return true;
                            return htmlBlocks[index] = partial;
                        }));
                    break;
                case 'html':
                    promises.push(Promise.resolve(htmlBlocks[index] = template.value));
                    break;
                case 'output':
                    var val = this.evalOutput(template, scope);
                    htmlBlocks[index] = val === undefined ? '' : stringify(val);
                    promises.push(Promise.resolve(htmlBlocks[index]));
            }
        });
        return Promise.all(promises)
            .then((results) => {
                return htmlBlocks.join('');
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
            return Promise.resolve('');
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
