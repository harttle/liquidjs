var chai = require("chai");
var should = chai.should();
chai.use(require("chai-as-promised"));

var context = require('../context.js');

describe('context', function() {
    var ctx;
    before(function(){
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

    it('should get desendent property', function() {
        ctx.get('bar[0]').should.equal('a');
        ctx.get('bar[1].b').should.deep.equal([1, 2]);
        ctx.get('bar[1].b[1]').should.equal(2);
    });

    it('should merge context', function() {
        ctx.merge({foo: 'foo', foo1: 'foo1'});
        ctx.get('foo').should.equal('foo');
        ctx.get('foo1').should.equal('foo1');
    });
});
