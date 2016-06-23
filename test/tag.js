var chai = require("chai");
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
var expect = chai.expect;
chai.use(sinonChai);

var tag = require('../src/tag.js')();
var Scope = require('../src/scope.js');

describe('tag', function() {
    var scope;
    before(function() {
        scope = Scope.factory({
            foo: 'bar',
            arr: [2, 1]
        });
        tag.clear();
    });

    it('should throw when not registered', function() {
        expect(function() {
            tag.construct({
                type: 'tag',
                value: 'foo',
                name: 'foo'
            }, []);
        }).to.throw(/tag foo not found/);
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
        tag.construct({
            type: 'tag',
            value: 'foo',
            name: 'foo'
        }, []).render(scope, {});
        expect(spy).to.have.been.called;
    });

    it('should call tag.render with resolved hash', function() {
        var spy = sinon.spy(),
            tokens = [];
        tag.register('foo', {
            render: spy
        });
        var token = {
            type: 'tag',
            value: 'foo aa:foo bb: arr[0] cc: 2.3',
            name: 'foo',
            args: 'aa:foo bb: arr[0] cc: 2.3'
        };
        tag.construct(token, []).render(scope, {});
        expect(spy).to.have.been.calledWithMatch(scope, {
            aa: 'bar',
            bb: 2,
            cc: 2.3
        });
    });
});
