const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')(), ctx;

function test(src, dst) {
    ctx = {
        date: new Date(),
        foo: 'bar',
        arr: [-2, 'a']
    };
    expect(liquid.render(src, ctx)).to.equal(dst);
}

describe('filters', function() {
    it('should support abs', function() {
        test('{{ -3 | abs }}', '3');
        test('{{ arr[0] | abs }}', '2');
    });

    it('should support append', function() {
        test('{{ -3 | append: "abc" }}', '-3abc');
        test('{{ "a" | append: foo }}', 'abar');
    });

    it('should support capitalize', function() {
        test('{{ "i am good" | capitalize }}', 'I am good');
    });

    it('should support ceil', function() {
        test('{{ 1.2 | ceil }}', '2');
        test('{{ 2.0 | ceil }}', '2');
        test('{{ "3.5" | ceil }}', '4');
        test('{{ 183.357 | ceil }}', '184');
    });

    it('should support date', function() {
        str = ctx.date.toDateString();
        test('{{ date | date:"%a %b %d %Y"}}', str);
    });

    it('should support default', function() {
        test('{{false |default: "a"}}', 'a');
    });

    it('should support divided_by', function() {
        test('{{4 | divided_by: 2}}', '2');
        test('{{16 | divided_by: 4}}', '4');
        test('{{5 | divided_by: 3}}', '1');
    });

    it('should support downcase', function() {
        test('{{ "Parker Moore" | downcase }}', 'parker moore');
        test('{{ "apple" | downcase }}', 'apple');
    });
    it('should support escape', function() {
        test('{{ "Have you read \'James & the Giant Peach\'?" | escape }}',
            'Have you read &#39;James &amp; the Giant Peach&#39;?');
        test('{{ "Tetsuro Takara" | escape }}', 'Tetsuro Takara');
    });
    it('should support escape_once', function() {
        test('{{ "1 < 2 & 3" | escape_once }}', '1 &lt; 2 &amp; 3');
        test('{{ "1 &lt; 2 &amp; 3" | escape_once }}', '1 &lt; 2 &amp; 3');
    });
});

