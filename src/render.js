const Syntax = require('./syntax.js');
const Promise = require('any-promise');
const mapSeries = require('./util/promise.js').mapSeries;
const RenderBreak = require('./util/error.js').RenderBreak;

var render = {

    renderTemplates: function(templates, scope, opts) {
        if (!scope) throw new Error('unable to evalTemplates: scope undefined');
        opts = opts || {};
        opts.strict_filters = opts.strict_filters || false;

        var html = '';
        return mapSeries(templates, (tpl) => {
            return renderTemplate.call(this, tpl)
                .then(partial => html += partial)
                .catch(e => {
                    if(e instanceof RenderBreak){
                        e.resolvedHTML = html;                
                    }
                    throw e;
                });
        }).then(() => html);

        function renderTemplate(template){
            if (template.type === 'tag') {
                return this.renderTag(template, scope, this.register)
                    .then(partial => partial === undefined ? '' : partial);
            } else if (template.type === 'output') {
                return Promise.resolve(this.evalOutput(template, scope, opts))
                    .then(partial => partial === undefined ? '' : stringify(partial));
            } else { // template.type === 'html'
                return Promise.resolve(template.value);
            }
        }
    },

    renderTag: function(template, scope, register) {
        if (template.name === 'continue') {
            return Promise.reject(new RenderBreak('continue'));
        }
        if (template.name === 'break') {
            return Promise.reject(new RenderBreak('break'));
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
