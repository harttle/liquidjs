const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

chai.use(sinonChai);

var filter = require('../filter.js')();
var Scope = require('../scope.js');

describe('filter', function() {
    var scope;
    beforeEach(function(){
        filter.clear();
        scope = Scope.factory();
    });
    it('should throw when not registered', function() {
        expect(function() {
            filter.construct('foo');
        }).to.throw(/filter foo not found/);
    });

    it('should register a simple filter', function(){
        filter.register('foo', x => x.toUpperCase());
        expect(filter.construct('foo').render('foo', scope)).to.equal('FOO');
    });

    it('should call filter with corrct arguments', function(){
        var spy = sinon.spy();
        filter.register('foo', spy);
        filter.construct('foo: 33').render('foo', scope);
        expect(spy).to.have.been.calledWith('foo', 33);
    });
});
