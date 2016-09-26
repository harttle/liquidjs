const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = chai.should();
const expect = chai.expect;
const Liquid = require('..');
const mock = require('mock-fs');
chai.use(chaiAsPromised);

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
    afterEach(function() {
        mock.restore();
    });
    it('should output object', function() {
        return engine.parseAndRender('{{obj}}', ctx).should.eventually.equal('{"foo":"bar"}');
    });
    it('should output array', function() {
        return engine.parseAndRender('{{arr}}', ctx).should.eventually.equal('[-2,"a"]');
    });
    it('should output undefined to empty', function() {
        return engine.parseAndRender('foo{{zzz}}bar', ctx).should.eventually.equal('foobar');
    });
    it('should parse html', function() {
        (function() {
            engine.parse('{{obj}}');
        }).should.not.throw();
        (function() {
            engine.parse('<html><head>{{obj}}</head></html>');
        }).should.not.throw();
    });
    it('should render template multiple times', function() {
        var template = engine.parse('{{obj}}');
        return engine.render(template, ctx)
            .then((result) => {
                expect(result).to.equal('{"foo":"bar"}');
                return engine.render(template, ctx);
            })
            .then((result) => {
                return expect(result).to.equal('{"foo":"bar"}');
            });
    });
    it('should render filters', function() {
        var template = engine.parse('<p>{{arr | join: "_"}}</p>');
        return engine.render(template, ctx).should.eventually.equal('<p>-2_a</p>');
    });
    describe('#renderFile()', function(){
        it('should render file', function() {
            return engine.renderFile('/root/files/foo.html', ctx).should.eventually.equal('foo');
        });
        it('should render file relative to root', function() {
            return engine.renderFile('files/foo.html', ctx).should.eventually.equal('foo');
        });
        it('should render file with context', function() {
            return engine.renderFile('/root/files/name.html', ctx).should.eventually.equal('My name is harttle.');
        });
        it('should render file with default extname', function() {
            return engine.renderFile('files/name', ctx).should.eventually.equal('My name is harttle.');
        });
    });
    // todo: make these async
//    describe('#express()', function() {
//        it('should render templates', function() {
//            engine.express()('/root/files/name.html', ctx, function(err, html) {
//                expect(err).to.equal(null);
//                expect(html).to.equal('My name is harttle.');
//            });
//        });
//        it('should pass error when file not found', function() {
//            engine.express()('/root/files/name1.html', ctx, function(err, html) {
//                expect(err.code).to.equal('ENOENT');
//            });
//        });
//    });
    describe('cache', function() {
        it('should be disabled by default', function() {
            mock({
                '/root/files/foo.html': 'bar'
            });
            return engine.renderFile('files/foo', ctx).should.eventually.equal('bar');
        });
        it('should respect cache=true option', function() {
            engine = Liquid({
                root: '/root/',
                extname: '.html',
                cache: true
            });
            return engine.renderFile('files/foo', ctx)
                .then((result) => {
                    return expect(result).to.equal('foo');
                })
                .then((result) => {
                    mock({
                        '/root/files/foo.html': 'bar'
                    });
                    return engine.renderFile('files/foo', ctx);
                })
                .then((result) => {
                    return expect(result).to.equal('foo');
                });

        });
    });
});
