var chai = require("chai");
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
var expect = chai.expect;
chai.use(sinonChai);

var tag = require('../tag.js');
var context = require('../context.js');

describe('tag', function() {
    var ctx;
    before(function(){
        ctx = context.factory({
            foo: 'bar',
            arr: [2, 1]
        });
        tag.clear();
    });

    it('should throw when not registered', function() {
        expect(function() {
            tag.parse('foo');
        }).to.throw(/tag foo not found/);
    });

    it('should throw when render method not defined', function() {
        expect(function() {
            tag.register('foo', {});
        }).to.throw(/expect foo.render to be a function/);
    });

    it('should register simple tag', function() {
        expect(
            function() {
                tag.register('foo', {
                    render: x => 'bar'
                });
            }).not.throw();
    });

    it('should call tag.render', function() {
        var spy = sinon.spy(),
            tokens = [];
        tag.register('foo', {
            render: spy
        });
        tag.parse('foo').render(tokens, ctx);
        expect(spy).to.have.been.called;
    });

    it('should call tag.render with resolved hash', function() {
        var spy = sinon.spy(),
            tokens = [];
        tag.register('foo', {
            render: spy
        });
        var t = tag.parse('foo aa:foo bb: arr[0] cc: 2.3');
        t.render(tokens, ctx);
        expect(spy).to.have.been.calledWithMatch(tokens, ctx, 'foo', {
            aa: 'bar',
            bb: 2,
            cc: 2.3
        });
    });
});
