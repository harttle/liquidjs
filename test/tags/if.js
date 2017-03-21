const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/if', function() {
    var liquid = Liquid();
    var ctx = {
        one: 1,
        two: 2,
        emptyString: '',
        emptyArray: []
    };

    it('should support if 1', function() {
        var src = '{% if false%}yes';
        return expect(liquid.parseAndRender(src, ctx))
            .to.be.rejectedWith(/tag {% if false%} not closed/);
    });
    it('should support if 2', function() {
        var src = '{%if emptyArray%}a{%endif%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('a');
    });
    it('should support if 3', function() {
        var src = '{% if 2==3 %}yes{%else%}no{%endif%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('no');
    });
    it('should support if 4', function() {
        var src = '{% if 1>=2 and one<two %}a{%endif%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('');
    });
    it('should support if 5', function() {
        var src = '{% if one!=two %}yes{%else%}no{%endif%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('yes');
    });
    it('should support if 6', function() {
        var src = '{% if false %}1{%elsif true%}2{%else%}3{%endif%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('2');
    });
    it('should support if 7', function() {
        var src = '{%if false%}{%if true%}{%else%}a{%endif%}{%endif%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('');
    });
    it('should return true if empty string', function() {
        var src = "{%if emptyString%}a{%endif%}";
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('a');
    });
});
