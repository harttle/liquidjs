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
            var isTemplateObject = false;
            var filepath = Liquid.evalValue(this.value, scope);
            if(this.with){
                hash[filepath] = Liquid.evalValue(this.with, scope);
            }
            return liquid.handleCache(filepath)
                .then((result) => {
                    var templates = [];
                    if (Array.isArray(result)) {
                        templates = result;
                    }
                    else if (result !== null && typeof result === 'object' && 'templates' in result) {
                        // result should be an object with signature {templates: [], model: {}}
                        isTemplateObject = true;
                        templates = result.templates;
                        // Also push the model from the result onto the scope
                        scope.push(result.model);
                    }
                    scope.push(hash);
                    return liquid.renderer.renderTemplates(templates, scope);
                })
                .then((html) => {
                    if (isTemplateObject) {
                        scope.pop();
                    }
                    scope.pop();
                    return html;
                });

        }
    });

};
