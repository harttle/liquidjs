
function factory(msg, token){
    var err = new Error(msg || 'unkown error');
    if(token){
        err.token = token.raw;
        err.line = token.line;
    }
    throw err;
}

module.exports = factory;
