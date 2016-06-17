const lexical = require('./lexical.js');
const error = require('./error.js');
const Exp = require('./expression.js');

function stringify(val) {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

function factory(Filter, Tag) {
    function renderTemplates(templates, scope) {
        var html = '';
        templates.some(template => {
            if (scope.get('forloop.skip')) return true;
            if (template.type === 'tag') {
                if (template.name === 'continue') {
                    scope.set('forloop.skip', true);
                    return true;
                }
                if (template.name === 'break') {
                    scope.set('forloop.stop', true);
                    scope.set('forloop.skip', true);
                    return true;
                }
                html += template.render(scope, this.register);
            } else if (template.type === 'html') {
                html += template.value;
            } else if (template.type === 'output') {
                var val = evalFilter(template.value, scope);
                html += stringify(val);
            }
        });
        return html;
    }

    function evalFilter(str, scope) {
        if (!scope) throw new Error('unable to evalFilter: scope undefined');
        var filters = str.split('|');
        var val = Exp.evalValue(filters.shift(), scope);
        return filters
            .map(str => Filter.construct(str))
            .reduce((v, filter) => filter.render(v, scope), val);
    }

    return {
        renderTemplates, evalFilter
    };
};

factory.stringify = stringify;

module.exports = factory;
