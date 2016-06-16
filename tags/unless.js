var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function(liquid) {
    liquid.registerTag('unless', {

        parse: function(tagToken, remainTokens) {
            this.branches = [];
            this.elseTemplates = [];

            var p, stream = liquid.parseStream(remainTokens)
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
                .onTag('else', token => this.elseTemplates = p = [])
                .onTag('endunless', token => stream.stop())
                .onTemplate(tpl => p.push(tpl))
                .onEnd(x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            for (var i = 0; i < this.branches.length; i++) {
                var branch = this.branches[i];
                var cond = liquid.evaluate(branch.cond, scope);
                cond = Liquid.isTruthy(cond);
                if (i === 0) cond = !cond;
                if (cond) {
                    return liquid.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderTemplates(this.elseTemplates, scope);
        }

    });
};
