const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/unless', function() {
    var liquid = Liquid();

    it('should support unless 1', function() {
        var src = '{% unless 1 %}yes{%else%}no{%endunless%}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('no');
    });
    it('should support unless 2', function() {
        var src = '{% unless 1>2 %}yes';
        return expect(liquid.parseAndRender(src))
            .to.be.rejectedWith(/tag {% unless 1>2 %} not closed/);
    });
    it('should support unless 3', function() {
        var src = '{% unless 1>2 %}yes{%endunless%}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('yes');
    });
    it('should support unless 4', function() {
        var src = '{% unless true %}{%endunless%}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('');
    });
});
