var Liquid = require('..');
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
            var tpl = liquid.handleCache(layout);

            scope.push({});
            liquid.renderer.renderTemplates(this.tpls, scope);
            var html = liquid.renderer.renderTemplates(tpl, scope);
            scope.pop();
            return html;
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
            if(html === undefined){
                html = liquid.renderer.renderTemplates(this.tpls, scope);
            }
            scope.set(`_liquid.blocks.${this.block}`, html);
            return html;
        }
    });

};
