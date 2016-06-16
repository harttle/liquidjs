var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp(`^(${lexical.identifier.source})\\s+in\\s+(.+)$`);

module.exports = function(liquid) {
    liquid.registerTag('for', {

        parse: function(tagToken, remainTokens) {
            var match = re.exec(tagToken.args);
            if(!match) throw new Error(`illegal tag: ${tagToken.raw}`);
            this.variable = match[1];
            this.collection = match[2];

            this.templates = [];
            this.elseTemplates = [];

            var p, stream = liquid.parseStream(remainTokens)
                .onStart(x => p = this.templates)
                .onTag('else', token => p = this.elseTemplates)
                .onTag('endfor', token => stream.stop())
                .onTemplate(tpl => p.push(tpl))
                .onEnd(x => {
                    throw new Error(`tag ${tagToken.raw} not closed`);
                });

            stream.start();
        },

        render: function(scope, hash) {
            var collection = liquid.evaluate(this.collection, scope);
            if(!(collection instanceof Array) || !collection.length){
                return liquid.renderTemplates(this.elseTemplates, scope);
            }

            liquid.renderTemplates(this.templates, scope);
        }
    });
};
