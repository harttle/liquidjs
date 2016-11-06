const Liquid = require('..');
const lexical = Liquid.lexical;
const withRE = new RegExp(`with\\s+(${lexical.value.source})`);
const assert = require('../src/util/assert.js');

module.exports = function(liquid) {

    liquid.registerTag('include', {
        parse: function(token){
            var match = lexical.value.exec(token.args);
            assert(match, `illegal token ${token.raw}`);
            this.value = match[0];

            match = withRE.exec(token.args);
            if(match){
                this.with = match[1];
            }
        },
        render: function(scope, hash) {
            var filepath = Liquid.evalValue(this.value, scope);

            var register = scope.get('liquid');
            var originBlocks = register.blocks;
            register.blocks = {};

            if(this.with){
                hash[filepath] = Liquid.evalValue(this.with, scope);
            }
            return liquid.getTemplate(filepath, register.root)
                .then((templates) => {
                    scope.push(hash);
                    return liquid.renderer.renderTemplates(templates, scope);
                })
                .then((html) => {
                    scope.pop();
                    register.blocks = originBlocks;
                    return html;
                });
        }
    });

};
