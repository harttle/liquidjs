var chai = require("chai");
var should = chai.should();
var expect = chai.expect;

var Scope = require('../src/scope.js');

describe('scope', function() {
    var scope;
    beforeEach(function(){
        scope = Scope.factory({
            foo: 'bar',
            bar: ['a', {b: [1, 2]}]
        });
    });

    it('should get property', function() {
        scope.get('foo').should.equal('bar');
    });

    it('should set property', function() {
        scope.set('foo', 'FOO');
        scope.get('foo').should.equal('FOO');
    });

    it('should set child property', function() {
        scope.set('oo.bar', 'FOO');
        scope.get('oo.bar').should.equal('FOO');
    });

    it('should get desendent property', function() {
        scope.get('bar[0]').should.equal('a');
        scope.get('bar[1].b').should.deep.equal([1, 2]);
        scope.get('bar[1].b[1]').should.equal(2);
    });

    it('should push scope', function() {
        scope.push({foo: 'foo', foo1: 'foo1'});
        scope.get('foo').should.equal('foo');
        scope.get('foo1').should.equal('foo1');
        scope.get('bar[1].b[1]').should.equal(2);
    });

    it('should pop scope', function() {
        scope.push({foo: 'foo', foo1: 'foo1'});
        scope.pop();
        expect(scope.get('foo')).to.equal('bar');
        expect(scope.get('foo1')).to.equal('');
        expect(scope.get('bar[1].b[1]')).to.equal(2);
    });
});
