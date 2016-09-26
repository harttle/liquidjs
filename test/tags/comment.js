const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/comment', function() {
    var liquid = Liquid();
    it('should support comment 1', function() {
        var src = '{% comment %}{% raw%}';
        return expect(liquid.parseAndRender(src))
            .to.be.rejectedWith(/{% comment %} not closed/);
    });
    it('should support comment 2', function() {
        var src = 'My name is {% comment %}super{% endcomment %} Shopify.';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('My name is  Shopify.');
    });
    it('should support comment 3', function() {
        var src = '{% comment %}\n{{ foo}} \n{% endcomment %}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('');
    });
});
