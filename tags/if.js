var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function(liquid) {
    liquid.registerTag('if', {

        parse: function(tagToken, remainTokens) {

            this.branches = [];
            this.elseTemplates = [];

            var p, stream = liquid.parser.parseStream(remainTokens)
                .onStart(x => this.branches.push({
                    cond: tagToken.args,
                    templates: p = []
                }))
                .onTag('elsif', token => {
                    if (!this.branches[token.args]) {
                        this.branches.push({
                            cond: token.args,
                            templates: p = []
                        });
                    }
                })
                .onTag('else', token => p = this.elseTemplates)
                .onTag('endif', token => stream.stop())
                .onTemplate(tpl => p.push(tpl))
                .onEnd(x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            for (var i = 0; i < this.branches.length; i++) {
                var branch = this.branches[i];
                var cond = Liquid.evalExp(branch.cond, scope);
                if (Liquid.isTruthy(cond)) {
                    return liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }

    });
};
