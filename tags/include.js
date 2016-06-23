var Liquid = require('..');
var lexical = Liquid.lexical;
var withRE = new RegExp(`with\\s+(${lexical.value.source})`);

module.exports = function(liquid) {

    liquid.registerTag('include', {
        parse: function(token){
            var match = lexical.value.exec(token.args);
            if(!match) error(`illegal token ${token.raw}`, token);
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
            var tpl = liquid.handleCache(filepath);
            scope.push(hash);
            var html = liquid.renderer.renderTemplates(tpl, scope);
            scope.pop();
            return html;
        }
    });

};
