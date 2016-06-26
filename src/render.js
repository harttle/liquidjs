const error = require('./error.js');
const Exp = require('./expression.js');
const assert = require('assert');

var render = {

    renderTemplates: function(templates, scope) {
        assert(scope, 'unable to evalTemplates: scope undefined');
        var html = '',
            partial;
        templates.some(template => {
            if (scope.get('forloop.skip')) return true;
            switch (template.type) {
                case 'tag':
                    partial = this.renderTag(template, scope, this.register);
                    if (partial === undefined) return true;
                    html += partial;
                    break;
                case 'html':
                    html += template.value;
                    break;
                case 'output':
                    var val = this.evalOutput(template, scope);
                    html += val === undefined ? '' : stringify(val);
            }
        });
        return html;
    },

    renderTag: function(template, scope, register) {
        if (template.name === 'continue') {
            scope.set('forloop.skip', true);
            return;
        }
        if (template.name === 'break') {
            scope.set('forloop.stop', true);
            scope.set('forloop.skip', true);
            return;
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
