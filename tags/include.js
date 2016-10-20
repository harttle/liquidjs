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
                        // Also add the model from the result onto the beginning of the scope array (unshift).
                        //  We want it at the beginning of the scope stack because we want the outer template to
                        //  override the default model that comes with this included template. e.g. a partial template
                        //  called 'header' might have a default title property value, but the template including
                        //  'header' should have its own title property supersede the default on the header template.
                        scope.unshift(result.model);
                    }
                    scope.push(hash);
                    return liquid.renderer.renderTemplates(templates, scope);
                })
                .then((html) => {
                    scope.pop(); // hash
                    if (isTemplateObject) {
                        // template model was added to the beginning of the scope array, so remove it (shift)
                        scope.shift(); // template model
                    }
                    return html;
                });

        }
    });

};
