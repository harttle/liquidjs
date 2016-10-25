const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

chai.use(sinonChai);

var filter = require('../src/filter.js')();
var Scope = require('../src/scope.js');

describe('filter', function() {
    var scope;
    beforeEach(function() {
        filter.clear();
        scope = Scope.factory();
    });
    it('should return undefined when not registered', function() {
        var result = filter.construct('foo');
        expect(result.name).to.equal('foo');
        expect(result.error).to.be.an('Error');
    });

    it('should throw when filter name illegal', function() {
        expect(function() {
            filter.construct('/');
        }).to.throw(/illegal filter/);
    });

    it('should parse argument syntax', function() {
        filter.register('foo', x => x);
        var f = filter.construct('foo: a, "b"');

        expect(f.name).to.equal('foo');
        expect(f.args).to.deep.equal(['a', '"b"']);
    });

    it('should register a simple filter', function() {
        filter.register('upcase', x => x.toUpperCase());
        expect(filter.construct('upcase').render('foo', scope)).to.equal('FOO');
    });

    it('should register a argumented filter', function() {
        filter.register('add', (a, b) => a + b);
        expect(filter.construct('add: 2').render(3, scope)).to.equal(5);
    });

    it('should register a multi-argumented filter', function() {
        filter.register('add', (a, b, c) => a + b + c);
        expect(filter.construct('add: 2, "c"').render(3, scope)).to.equal("5c");
    });

    it('should call filter with corrct arguments', function() {
        var spy = sinon.spy();
        filter.register('foo', spy);
        filter.construct('foo: 33').render('foo', scope);
        expect(spy).to.have.been.calledWith('foo', 33);
    });
});
