var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function(liquid) {
    liquid.registerTag('case', {

        parse: function(tagToken, remainTokens) {
            this.cond = tagToken.args;
            this.cases = [];
            this.elseTemplates = [];

            var p = [],
                stream = liquid.parser.parseStream(remainTokens)
                .onTag('when', token => {
                    if (!this.cases[token.args]) {
                        this.cases.push({
                            val: token.args,
                            templates: p = []
                        });
                    }
                })
                .onTag('else', token => p = this.elseTemplates)
                .onTag('endcase', token => stream.stop())
                .onTemplate(tpl => p.push(tpl))
                .onEnd(x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            for (var i = 0; i < this.cases.length; i++) {
                var branch = this.cases[i];
                var val = Liquid.evalExp(branch.val, scope);
                var cond = Liquid.evalExp(this.cond, scope);
                if (val === cond) {
                    return liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }

    });
};
