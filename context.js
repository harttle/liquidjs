const _ = require('lodash');
const identifier = require('./identifier.js');

var context = {
    get: function(str){
        if(identifier.isLiteral(str)){
            return identifier.parseLiteral(str);
        } 
        if(identifier.isVariable(str)){
            return _.get(this.context, str);
        }
        return '';
    },
    init: function(ctx){
        this.context = ctx;
    },
    merge: function(ctx){
        _.merge(this.context, ctx);
    }
};

exports.factory = function(_ctx){
    var ctx = Object.create(context);
    ctx.init(_ctx);
    return ctx;
};
