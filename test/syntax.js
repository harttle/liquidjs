const chai = require("chai");
const expect = chai.expect;
var syntax = require('../src/syntax.js');
var Scope = require('../src/scope.js');

var evalExp = syntax.evalExp;
var evalValue = syntax.evalValue;

describe('expression', function() {
    var scope;

    beforeEach(function() {
        scope = Scope.factory({
            one: 1,
            two: 2,
            x: 'XXX'
        });
    });

    it('should eval literals', function() {
        expect(evalValue('2.3')).to.equal(2.3);
        expect(evalValue('"foo"')).to.equal("foo");
    });

    it('should throw on illegal expression', function() {
        expect(function() {
            evalExp('1 contains "x"', scope);
        }).to.throw();
    });

    it('should eval variables', function() {
        expect(evalValue('23', scope)).to.equal(23);
        expect(evalValue('one', scope)).to.equal(1);
        expect(evalValue('x', scope)).to.equal('XXX');
    });

    describe('.evalExp()', function() {

        it('should throw when scope undefined', function() {
            expect(function() {
                evalExp('');
            }).to.throw(/scope undefined/);
        });

        it('should eval simple expression', function() {
            expect(evalExp('1<2', scope)).to.equal(true);
            expect(evalExp('2<=2', scope)).to.equal(true);
            expect(evalExp('one<=two', scope)).to.equal(true);
            expect(evalExp('x contains "x"', scope)).to.equal(false);
            expect(evalExp('x contains "X"', scope)).to.equal(true);
            expect(evalExp('"<=" == "<="', scope)).to.equal(true);
        });

        it('should eval complex expression', function() {
            expect(evalExp('1<2 and x contains "x"', scope)).to.equal(false);
            expect(evalExp('1<2 or x contains "x"', scope)).to.equal(true);
            expect(evalExp('false or true', scope)).to.equal(true);
        });

        it("should eval range expression", function() {
            expect(evalExp('(2..4)', scope)).to.deep.equal([2, 3, 4]);
            expect(evalExp('(two..4)', scope)).to.deep.equal([2, 3, 4]);
        });
    });
});
