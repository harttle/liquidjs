const context = require('./context');
const tokenizer = require('./tokenizer.js');
const render = require('./render.js');
const lexical = require('./lexical.js');

exports.render = function(html, ctx){
    return render(tokenizer(html), context.factory(ctx));
};

exports.lexical = lexical;
