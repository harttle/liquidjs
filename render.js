const error = require('./error.js');
const Exp = require('./expression.js');
const assert = require('assert');

function stringify(val) {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

function factory(Filter, Tag) {

    function renderTemplates(templates, scope) {
        assert(scope, 'unable to evalTemplates: scope undefined');
        var html = '', partial;
        templates.some(template => {
            if (scope.get('forloop.skip')) return true;
            switch (template.type) {
                case 'tag':
                    partial = renderTag(template, scope, this.register);
                    if(partial === undefined) return true;
                    html += partial;
                    break;
                case 'html':
                    html += template.value;
                    break;
                case 'output':
                    var val = evalOutput(template, scope);
                    html += stringify(val);
            }
        });
        return html;
    }

    function renderTag(template, scope, register) {
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
    }

    function evalOutput(template, scope) {
        assert(scope, 'unable to evalOutput: scope undefined');
        var val = Exp.evalExp(template.initial, scope);
        return template.filters
            .reduce((v, filter) => filter.render(v, scope), val);
    }

    return {
        renderTemplates, evalOutput, renderTag
    };
}

factory.stringify = stringify;

module.exports = factory;
