var chai = require("chai");
var should = chai.should();
var expect = chai.expect;

var context = require('../context.js');

describe('context', function() {
    var ctx;
    beforeEach(function(){
        ctx = context.factory({
            foo: 'bar',
            bar: ['a', {b: [1, 2]}]
        });
    });

    it('should parse literal', function() {
        ctx.get('2.3').should.equal(2.3);
        ctx.get('(2..4)').should.deep.equal([2,3]);
        ctx.get('"foo"').should.equal("foo");
    });

    it('should get property', function() {
        ctx.get('foo').should.equal('bar');
    });

    it('should set property', function() {
        ctx.set('foo', 'FOO');
        ctx.get('foo').should.equal('FOO');
    });

    it('should get desendent property', function() {
        ctx.get('bar[0]').should.equal('a');
        ctx.get('bar[1].b').should.deep.equal([1, 2]);
        ctx.get('bar[1].b[1]').should.equal(2);
    });

    it('should push context', function() {
        ctx.push({foo: 'foo', foo1: 'foo1'});
        ctx.get('foo').should.equal('foo');
        ctx.get('foo1').should.equal('foo1');
        ctx.get('bar[1].b[1]').should.equal(2);
    });

    it('should pop context', function() {
        ctx.push({foo: 'foo', foo1: 'foo1'});
        ctx.pop();
        expect(ctx.get('foo')).to.equal('bar');
        expect(ctx.get('foo1')).to.equal('');
        expect(ctx.get('bar[1].b[1]')).to.equal(2);
    });
});
