const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')();

describe('filters', function() {
    var ctx = {
        foo: 'bar',
        arr: [-2, 'a']
    };

    it('should support abs', function() {
        expect(liquid.render('{{ -3 | abs }}')).to.equal('3');
        expect(liquid.render('{{ arr[0] | abs }}', ctx)).to.equal('2');
    });

    it('should support append', function() {
        expect(liquid.render('{{ -3 | append: "abc" }}')).to.equal('-3abc');
        expect(liquid.render('{{ "a" | append: foo }}', ctx)).to.equal('abar');
    });

    it('should support capitalize', function() {
        expect(liquid.render('{{ "i am good" | capitalize }}')).to.equal('I am good');
    });

    it('should support ceil', function() {
        expect(liquid.render('{{ 1.2 | ceil }}')).to.equal('2');
        expect(liquid.render('{{ 2.0 | ceil }}')).to.equal('2');
        expect(liquid.render('{{ "3.5" | ceil }}')).to.equal('4');
        expect(liquid.render('{{ 183.357 | ceil }}')).to.equal('184');
    });

    it('should support date', function() {
        var d = ctx.date = new Date();
        str = d.toDateString();
        expect(liquid.render('{{ date | date:"%a %b %d %Y"}}', ctx)).to.equal(str);
    });

    it('should support default', function() {
        expect(liquid.render('{{false |default: "a"}}')).to.equal('a');
    });

    it('should support divided_by', function() {
        expect(liquid.render('{{4 | divided_by: 2}}')).to.equal('2');
        expect(liquid.render('{{16 | divided_by: 4}}')).to.equal('4');
        expect(liquid.render('{{5 | divided_by: 3}}')).to.equal('1');
    });

    it('should support downcase', function() {
        expect(liquid.render('{{ "Parker Moore" | downcase }}')).to.equal('parker moore');
        expect(liquid.render('{{ "apple" | downcase }}')).to.equal('apple');
    });
});
