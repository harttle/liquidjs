const Liquid = require('..');

module.exports = function(liquid) {
    liquid.registerTag('if', {

        parse: function(tagToken, remainTokens) {

            this.branches = [];
            this.elseTemplates = [];

            var p, stream = liquid.parser.parseStream(remainTokens)
                .on('start', x => this.branches.push({
                    cond: tagToken.args,
                    templates: p = []
                }))
                .on('tag:elsif', token => {
                    if (!this.branches[token.args]) {
                        this.branches.push({
                            cond: token.args,
                            templates: p = []
                        });
                    }
                })
                .on('tag:else', token => p = this.elseTemplates)
                .on('tag:endif', token => stream.stop())
                .on('template', tpl => p.push(tpl))
                .on('end', x => {
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
