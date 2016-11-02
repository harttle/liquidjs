const Liquid = require('..');

module.exports = function(liquid) {
    liquid.registerTag('unless', {
        parse: function(tagToken, remainTokens) {
            this.templates = [];
            this.elseTemplates = [];
            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('start', x => {
                    p = this.templates;
                    this.cond = tagToken.args;
                })
                .on('tag:else', token => p = this.elseTemplates)
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
