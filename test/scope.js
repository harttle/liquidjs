const chai = require("chai");
const expect = chai.expect;

var Scope = require('../src/scope.js');

describe('scope', function() {
    var scope, ctx;
    beforeEach(function() {
        ctx = {
            foo: 'bar'
        };
        scope = Scope.factory(ctx);
    });

    it('should get direct property', function() {
        expect(scope.get('foo')).equal('bar');
    });

    it('should get undefined property', function() {
        function fn() {
            scope.get('notdefined');
        }
        expect(fn).to.not.throw();
        expect(scope.get('notdefined')).to.equal(undefined);
        expect(scope.get('')).to.equal(undefined);
        expect(scope.get(false)).to.equal(undefined);
    });

    it('should throw undefined in strict mode', function() {
        scope = Scope.factory(ctx, {
            strict: true
        });

        function fn() {
            scope.get('notdefined');
        }
        expect(fn).to.throw(/undefined variable: notdefined/);
    });

    it('should get all properties when arguments empty', function() {
        expect(scope.get()).deep.equal(ctx);
    });

    it('should access child property via dot syntax', function() {
        scope.set('oo.bar', 'FOO');
        expect(scope.get('oo.bar')).to.equal('FOO');
    });

    it('should access child property via [<Number>] syntax', function() {
        scope.set('bar', ['a', {'b': [1,2]}]);
        expect(scope.get('bar[0]')).to.equal('a');
        expect(scope.get('bar[1].b')).to.deep.equal([1, 2]);
        expect(scope.get('bar[1].b[1]')).to.equal(2);
    });

    it('should push scope', function() {
        scope.set('bar', 'bar');
        scope.push({
            foo: 'foo'
        });
        expect(scope.get('foo')).to.equal('foo');
        expect(scope.get('bar')).to.equal('bar');
    });

    it('should pop scope', function() {
        scope.push({
            foo: 'foo'
        });
        scope.pop();
        expect(scope.get('foo')).to.equal('bar');
    });

    it('should unshift scope', function() {
        scope.unshift({foo: 'blue', foo1: 'foo1'})
        scope.get('foo').should.equal('bar');
        scope.get('foo1').should.equal('foo1');
    });

    it('should shift scope', function() {
        scope.unshift({foo: 'blue', foo1: 'foo1'});
        scope.shift();
        expect(scope.get('foo')).to.equal('bar');
        expect(scope.get('foo1')).to.equal(undefined);
    });
});
