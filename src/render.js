const Syntax = require('./syntax.js');
const Promise = require('any-promise');
const mapSeries = require('./util/promise.js').mapSeries;
const RenderBreak = require('./util/error.js').RenderBreak;
const assert = require('./util/assert.js');

var render = {

    renderTemplates: function(templates, scope) {
        assert(scope, 'unable to evalTemplates: scope undefined');

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
                return this.renderTag(template, scope)
                    .then(partial => partial === undefined ? '' : partial);
            } else if (template.type === 'output') {
                return Promise.resolve(this.evalOutput(template, scope))
                    .then(partial => partial === undefined ? '' : stringify(partial));
            } else { // template.type === 'html'
                return Promise.resolve(template.value);
            }
        }
    },

    renderTag: function(template, scope) {
        if (template.name === 'continue') {
            return Promise.reject(new RenderBreak('continue'));
        }
        if (template.name === 'break') {
            return Promise.reject(new RenderBreak('break'));
        }
        return template.render(scope, this.register);
    },

    evalOutput: function(template, scope) {
        assert(scope, 'unable to evalOutput: scope undefined');
        var val = Syntax.evalExp(template.initial, scope);
        template.filters.some(filter => {
            if (filter.error) {
                if (this.register.strict_filters) {
                    throw filter.error;
                } else { 
                    val = ''
                    return true;
                }
            }
            val = filter.render(val, scope);
        });
        return val;
    },

    initRegister: function(opts) {
        return this.register = opts;
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
