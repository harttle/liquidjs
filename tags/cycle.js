var Liquid = require('..');
var lexical = Liquid.lexical;
var groupRE = new RegExp(`^(?:(${lexical.value.source})\\s*:\\s*)?(.*)$`);
var candidatesRE = new RegExp(lexical.value.source, 'g');

module.exports = function(liquid) {
    liquid.registerTag('cycle', {

        parse: function(tagToken, remainTokens) {
            var match = groupRE.exec(tagToken.args);
            if(!match) throw new Error(`illegal tag: ${tagToken.raw}`);

            this.group = match[1] || '';
            var candidates = match[2];

            this.candidates = [];

            while(match = candidatesRE.exec(candidates)){
                this.candidates.push(match[0]);
            }

            if (!this.candidates.length){
                throw new Error(`empty candidates: ${tagToken.raw}`);
            }
        },

        render: function(scope, hash, register) {
            var fingerprint = Liquid.evalValue(this.group, scope) + ':' + 
                this.candidates.join(',');
            var idx = register[fingerprint];

            if(idx === undefined){
                idx = register[fingerprint] = 0;
            }

            var candidate = this.candidates[idx];
            idx = (idx + 1) % this.candidates.length;
            register[fingerprint] = idx;

            return Liquid.evalValue(candidate, scope);
        }
    });
};
