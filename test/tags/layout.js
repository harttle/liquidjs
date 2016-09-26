const Liquid = require('../..');
const mock = require('mock-fs');
const chai = require("chai");
const expect = chai.expect;
const error = require('../../src/error.js');
chai.use(require("chai-as-promised"));

describe('tags/layout', function() {
    var liquid;
    before(function() {
        liquid = Liquid({
            root: '/',
            extname: '.html'
        });
    });
    beforeEach(function() {
        mock({
            '/default-layout.html': 'foo{% block %}Default{% endblock %}foo',
            '/multi-blocks-layout.html': 'foo{% block "a"%}{% endblock %}{% block b%}{%endblock%}foo',
            '/multi-blocks.html': '{% layout "multi-blocks-layout" %}{%block a%}aaa{%endblock%},{%block b%};{%block c%}ccc{%endblock%};{%endblock%}',
        });
    });
    afterEach(function() {
        mock.restore();
    });

    it('should throw when block not closed', function() {
        src = '{% layout "default-layout" %}{%block%}bar';
        return expect(liquid.parseAndRender(src)).to
            .be.rejectedWith(/tag {%block%} not closed/);
    });
    it('should support layout', function() {
        src = '{% layout "default-layout" %}{%block%}bar{%endblock%}';
        return expect(liquid.parseAndRender(src)).to
            .eventually.equal('foobarfoo');
    });
    it('should support layout: multiple blocks', function() {
        src = '{% layout "multi-blocks-layout" %}' +
            '{%block a%}bara{%endblock%}' +
            '{%block b%}barb{%endblock%}';
        return expect(liquid.parseAndRender(src)).to
            .eventually.equal('foobarabarbfoo');
    });
    it('should support layout: nested 1', function() {
        src = '{% layout "multi-blocks" %}{% block a%}A{%endblock%}{%block c%}C{%endblock%}';
        return expect(liquid.parseAndRender(src)).to
            .eventually.equal('fooA;C;foo');
    });
    it('should support layout: nested 2', function() {
        src = '{% layout "multi-blocks" %}{%block c%}C{%endblock%}';
        return expect(liquid.parseAndRender(src)).to
            .eventually.equal('fooaaa;C;foo');
    });

});
