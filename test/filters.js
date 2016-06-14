const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')();

describe('filters', function() {
    var ctx = {
        foo: 'bar',
        arr: [-2, 'a']
    };

    it('should support abs', function() {
        expect(liquid.render('{{ -3 | abs }}', ctx)).to.equal('3');
        expect(liquid.render('{{ arr[0] | abs }}', ctx)).to.equal('2');
    });
});
