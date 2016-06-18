var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function(liquid) {
    liquid.registerTag('unless', {
        parse: function(tagToken, remainTokens) {
            var p, stream = liquid.parseStream(remainTokens)
                .onStart(x => {
                    p = this.templates = [];
                    this.cond = tagToken.args;
                })
                .onTag('else', token => this.elseTemplates = p = [])
                .onTag('endunless', token => stream.stop())
                .onTemplate(tpl => p.push(tpl))
                .onEnd(x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            var cond = Liquid.evalExp(this.cond, scope);
            return Liquid.isFalsy(cond) ?
                liquid.renderTemplates(this.templates, scope) :
                liquid.renderTemplates(this.elseTemplates, scope);
        }
    });
};
