const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/case', function() {
    var liquid = Liquid();

    it('should support case 1', function() {
        var src = '{% case "foo"%}';
        return expect(liquid.parseAndRender(src))
            .to.be.rejectedWith(/{% case "foo"%} not closed/);
    });
    it('should support case 2', function() {
        var src = '{% case "foo"%}' +
            '{% when "foo" %}foo{% when "bar"%}bar' +
            '{%endcase%}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('foo');
    });
    it('should support case 3', function() {
        var src = '{% case empty %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}';
        var ctx = {
            empty: ''
        };
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('bar');
    });
    it('should support case 4', function() {
        var src = '{% case false %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('');
    });
    it('should support case 5', function() {
        var src = '{% case "a" %}' +
            '{% when "b" %}b{% when "c"%}c{%else %}d' +
            '{%endcase%}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('d');
    });
});
