const chai = require("chai");
const expect = chai.expect;
const should = chai.should;
const Liquid = require('..');

describe('liquid', function() {
    var engine, ctx;
    beforeEach(function() {
        engine = Liquid();
        ctx = {
            date: new Date(),
            foo: 'bar',
            arr: [-2, 'a'],
            obj: {
                foo: 'bar'
            },
            posts: [{
                category: 'foo'
            }, {
                category: 'bar'
            }]
        };
    });
    it('should output object', function() {
        engine.parseAndRender('{{obj}}', ctx).should.equal('{"foo":"bar"}');
    });
    it('should output array', function() {
        engine.parseAndRender('{{arr}}', ctx).should.equal('[-2,"a"]');
    });
    it('should parse html', function() {
        (function(){
            engine.parse('{{obj}}');
        }).should.not.throw();
        (function(){
            engine.parse('<html><head>{{obj}}</head></html>');
        }).should.not.throw();
    });
    it('should render template multiple times', function() {
        var template = engine.parse('{{obj}}');
        engine.render(template, ctx).should.equal('{"foo":"bar"}');
        engine.render(template, ctx).should.equal('{"foo":"bar"}');
    });
    it('should render filters', function() {
        var template = engine.parse('<p>{{arr | join: "_"}}</p>');
        engine.render(template, ctx).should.equal('<p>-2_a</p>');
    });
});
