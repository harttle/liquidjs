var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function(liquid) {
    liquid.registerTag('unless', {
        parse: function(tagToken, remainTokens) {
            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('start', x => {
                    p = this.templates = [];
                    this.cond = tagToken.args;
                })
                .on('tag:else', token => this.elseTemplates = p = [])
                .on('tag:endunless', token => stream.stop())
                .on('template', tpl => p.push(tpl))
                .on('end', x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            var cond = Liquid.evalExp(this.cond, scope);
            return Liquid.isFalsy(cond) ?
                liquid.renderer.renderTemplates(this.templates, scope) :
                liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }
    });
};
