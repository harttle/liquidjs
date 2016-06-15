const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')(),
    ctx;

function test(src, dst) {
    expect(liquid.render(src, ctx)).to.equal(dst);
}

function testThrow (src, pattern) {
    expect(function() {
        liquid.render(src, ctx);
    }).to.throw(pattern);
}

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
        test('{% assign foo="bar"%}{{foo}}', 'bar');
    });
    it('should support case', function() {
        testThrow('{% case "foo"%}', /case "foo" not closed/);
        test('{% case "foo"%}' +
            '{% when "foo" %}foo{% when "bar"%}bar' +
            '{%endcase%}', 'foo');
        test('{% case empty %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}', 'bar');
        test('{% case false %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}', '');
        test('{% case "a" %}' +
            '{% when "b" %}b{% when "c"%}c{%else %}d' +
            '{%endcase%}', 'd');
    });

    it('should support if', function() {
        test('{% if 2==3 %}yes{%else%}no{%endif%}', 'no');
        test('{% if 1==2 and one<two %}a{%endif%}', '');
        test('{% if false %}yes{%else%}no{%endif%}', 'no');
    });

    it('should support unless', function() {
        test('{% unless 1 %}yes{%else%}no{%endunless%}', 'no');
        test('{% unless 1>2 %}yes{%endunless%}', 'yes');
    });

    it('should support capture', function() {
        test('{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}', 'A');
        testThrow('{% capture = %}{%endcapture%}', /= not valid identifier/);
    });

    it('should support increment', function() {
        test('{% increment foo %}{%increment foo%}{{foo}}', '2');
        test('{% increment one %}{{one}}', '2');
    });

    it('should support decrement', function() {
        test('{% decrement foo %}{%decrement foo%}{{foo}}', '-2');
        test('{% decrement one %}{{one}}', '0');
    });
});
