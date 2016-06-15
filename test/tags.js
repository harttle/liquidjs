const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')(),
    ctx;

describe('tags', function() {
    beforeEach(function() {
        ctx = {
            one: 1,
            two: 2,
            leq: '<=',
            empty: '',
            foo: 'bar',
            arr: [-2, 'a']
        };
    });
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

    it('should support if', function() {
        expect(liquid.render('{% if 2==3 %}yes{%else%}no{%endif%}', ctx)).to.equal('no');
        expect(liquid.render('{% if 1==2 and one<two %}a{%endif%}', ctx)).to.equal('');
        expect(liquid.render('{% if false %}yes{%else%}no{%endif%}', ctx)).to.equal('no');
    });

    it('should support unless', function() {
        expect(liquid.render('{% unless 1 %}yes{%else%}no{%endunless%}', ctx)).to.equal('no');
        expect(liquid.render('{% unless 1>2 %}yes{%endunless%}', ctx)).to.equal('yes');
    });

    it('should support capture', function() {
        expect(liquid.render('{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}', ctx)).to.equal('A');
        expect(function() {
            liquid.render('{% capture = %}{%endcapture%}', ctx);
        }).to.throw(/= not valid identifier/);
    });

    it('should support increment', function() {
        expect(liquid.render('{% increment foo %}{%increment foo%}{{foo}}', ctx)).to.equal('2');
        expect(liquid.render('{% increment one %}{{one}}', ctx)).to.equal('2');
    });

    it('should support decrement', function() {
        expect(liquid.render('{% decrement foo %}{%decrement foo%}{{foo}}', ctx)).to.equal('-2');
        expect(liquid.render('{% decrement one %}{{one}}', ctx)).to.equal('0');
    });
});
