var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var withRE = new RegExp(`with\\s+(${lexical.value.source})`);

module.exports = function(liquid) {

    liquid.registerTag('layout', {
        parse: function(token, remainTokens){
            var match = lexical.value.exec(token.args);
            if(!match) error(`illegal token ${token.raw}`, token);

            this.layout = match[0];
            this.tpls = liquid.parser.parse(remainTokens);
        },
        render: function(scope, hash) {
            var layout = Liquid.evalValue(this.layout, scope);

            var html = '';
            scope.push({});
            // not sure if this first one is needed, since the results are ignored
            return liquid.renderer.renderTemplates(this.tpls, scope)
                .then((partial) => {
                    html += partial;
                    return liquid.handleCache(layout)
                })
                .then((templates) => {
                    return liquid.renderer.renderTemplates(templates, scope);
                })
                .then((partial) => {
                    scope.pop();
                    return partial;
                })
                .catch((e) => {
                    e.file = layout;
                    throw e;
                });

//            var tpl = liquid.handleCache(layout);
//
//            scope.push({});
//            liquid.renderer.renderTemplates(this.tpls, scope);  // what's the point of this line?
//            var html = liquid.renderer.renderTemplates(tpl, scope);
//            scope.pop();
//            return html;
        }
    });

    liquid.registerTag('block', {
        parse: function(token, remainTokens){
            var match = /\w+/.exec(token.args);
            this.block = match ? match[0] : '';

            this.tpls = [];
            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('tag:endblock', token => stream.stop())
                .on('template', tpl => this.tpls.push(tpl))
                .on('end', x => {
                    throw new Error(`tag ${token.raw} not closed`);
                });
            stream.start();
        },
        render: function(scope, hash){
            var html = scope.get(`_liquid.blocks.${this.block}`);
            var promise = Promise.resolve('');
            if (html === undefined) {
                promise = liquid.renderer.renderTemplates(this.tpls, scope)
                    .then((partial) => {
                        scope.set(`_liquid.blocks.${this.block}`, partial);
                        return partial;
                    });
            }
            else {
                scope.set(`_liquid.blocks.${this.block}`, html);
                promise = Promise.resolve(html);
            }
            return promise;

//            if(html === undefined){
//                html = liquid.renderer.renderTemplates(this.tpls, scope);
//            }
//            scope.set(`_liquid.blocks.${this.block}`, html);
//            return html;
        }
    });

};
