var Liquid = require('..');
var lexical = Liquid.lexical;
var withRE = new RegExp(`with\\s+(${lexical.value.source})`);

module.exports = function(liquid) {

    liquid.registerTag('include', {
        parse: function(token){
            var match = lexical.value.exec(token.args);
            if(!match) throw(new Error(`illegal token ${token.raw}`));
            this.value = match[0];

            match = withRE.exec(token.args);
            if(match){
                this.with = match[1];
            }
        },
        render: function(scope, hash) {
            var filepath = Liquid.evalValue(this.value, scope);
            if(this.with){
                hash[filepath] = Liquid.evalValue(this.with, scope);
            }
            return liquid.getTemplate(filepath)
                .then((templates) => {
                    scope.push(hash);
                    return liquid.renderer.renderTemplates(templates, scope);
                })
                .then((html) => {
                    scope.pop();
                    return html;
                });
        }
    });

};
