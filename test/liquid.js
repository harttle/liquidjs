const chai = require("chai");
const expect = chai.expect;
const should = chai.should;
const Liquid = require('..');
const mock = require('mock-fs');

describe('liquid', function() {
    var engine, ctx;
    beforeEach(function() {
        ctx = {
            name: 'harttle',
            arr: [-2, 'a'],
            obj: {
                foo: 'bar'
            }
        };
        engine = Liquid({
            root: '/root/',
            extname: '.html'
        });
        mock({
            '/root/files/foo.html': 'foo',
            '/root/files/name.html': 'My name is {{name}}.'
        });
    });
    afterEach(function(){
        mock.restore();
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
    it('should render file', function(){
        engine.renderFile('/root/files/foo.html', ctx).should.equal('foo');
    });
    it('should render file relative to root', function(){
        engine.renderFile('files/foo.html', ctx).should.equal('foo');
    });
    it('should render file with context', function(){
        engine.renderFile('/root/files/name.html', ctx).should.equal('My name is harttle.');
    });
    it('should render file with default extname', function() {
        engine.renderFile('files/name', ctx).should.equal('My name is harttle.');
    });
    it('should disable cache by default', function(){
        mock({
            '/root/files/foo.html': 'bar'
        });
        engine.renderFile('files/foo', ctx).should.equal('bar');
    });
    it('should respect cache option', function(){
        mock.restore();
        engine = Liquid({
            root: '/root/',
            extname: '.html',
            cache: true
        });
        mock({
            '/root/files/foo.html': 'foo'
        });
        engine.renderFile('files/foo', ctx).should.equal('foo');
        mock({
            '/root/files/foo.html': 'bar'
        });
        engine.renderFile('files/foo', ctx).should.equal('foo');
    });
});
