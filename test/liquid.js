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
    it('should render as null when filter undefined', function() {
        return engine.parseAndRender('{{arr | filter1}}', ctx).should.eventually.equal('');
    });
    it('should throw upon undefined filter when strict_filters set', function() {
        var opts = {
            strict_filters: true
        };
        return expect(engine.parseAndRender('{{arr | filter1}}', ctx, opts)).to
            .be.rejectedWith(/undefined filter: filter1/);
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
    it('should render accessive filters', function() {
        var src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
            '{{ my_array | first }}';
        return expect(engine.parseAndRender(src)).to.eventually.equal('apples');
    });
    describe('#renderFile()', function() {
        it('should render file', function() {
            return engine.renderFile('/root/files/foo.html', ctx).should.eventually.equal('foo');
        });
        it('should accept relative path', function() {
            return expect(engine.renderFile('files/foo.html')).to.eventually.equal('foo');
        });
        it('should render file with context', function() {
            return engine.renderFile('/root/files/name.html', ctx).should.eventually.equal('My name is harttle.');
        });
        it('should use default extname', function() {
            return engine.renderFile('files/name', ctx).should.eventually.equal('My name is harttle.');
        });
        it('should accept root with no trailing slash', function() {
            engine = Liquid({
                root: '/root',
                extname: '.html'
            });
            return expect(engine.renderFile('files/foo.html')).to.eventually.equal('foo');
        });
        it('should accept dot path', function() {
            return expect(engine.renderFile('./files/foo.html')).to.eventually.equal('foo');
        });
        it('should accept double-dot path', function() {
            return expect(engine.renderFile('files/foo/../foo.html')).to.eventually.equal('foo');
        });
    });
    describe('#express()', function() {
        it('should render templates', function() {
            engine.express()('/root/files/name.html', ctx, function(err, html) {
                expect(err).to.equal(null);
                expect(html).to.equal('My name is harttle.');
            });
        });
        it('should pass error when file not found', function() {
            engine.express()('/root/files/name1.html', ctx, function(err, html) {
                expect(err.code).to.equal('ENOENT');
            });
        });
    });
    describe('strict', function() {
        it('should not throw when strict_variables false (default)', function() {
            return expect(engine.parseAndRender('before{{notdefined}}after', ctx)).to
                .eventually.equal('beforeafter');
        });
        it('should throw when strict_variables true', function() {
            var tpl = engine.parse('before{{notdefined}}after');
            var opts = {
                strict_variables: true
            };
            return expect(engine.render(tpl, ctx, opts)).to
                .be.rejectedWith(/undefined variable: notdefined/);
        });
        it('should pass strict_variables to render by parseAndRender', function() {
            var html = 'before{{notdefined}}after';
            var opts = {
                strict_variables: true
            };
            return expect(engine.parseAndRender(html, ctx, opts)).to
                .be.rejectedWith(/undefined variable: notdefined/);
        });
    });
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
