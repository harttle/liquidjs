const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')();

var ctx = {
    empty: '',
    foo: 'bar',
    arr: [-2, 'a']
};

describe('tags', function() {
    it('should support assign', function() {
        expect(liquid.render('{% assign foo="bar"%}{{foo}}', ctx)).to.equal('bar');
    });
    it('should support case', function() {
        expect(function() {
            liquid.render('{% case "foo"%}');
        }).to.throw(/case "foo" not closed/);
        expect(liquid.render('{% case "foo"%}' +
            '{% when "foo" %}foo{% when "bar"%}bar' +
            '{%endcase%}', ctx)).to.equal('foo');
        expect(liquid.render('{% case empty %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}')).to.equal('bar');
        expect(liquid.render('{% case false %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}')).to.equal('');
        expect(liquid.render('{% case "a" %}' +
            '{% when "b" %}b{% when "c"%}c{%else %}d' +
            '{%endcase%}')).to.equal('d');
    });
});

