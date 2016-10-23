const chai = require("chai");
const expect = chai.expect;

var lexical = require('../src/lexical.js');

describe('lexical', function() {
    it('should test filter syntax', function() {
        lexical.filterLine.test('abs').should.equal(true);
        lexical.filterLine.test('plus:1').should.equal(true);
        lexical.filterLine.test('replace: "a", b').should.equal(true);
        lexical.filterLine.test('foo: a, "b"').should.equal(true);
        lexical.filterLine.test('abs | another').should.equal(false);
        lexical.filterLine.test('join: "," | another').should.equal(false);
    });
    it('should test boolean literal', function() {
        lexical.isLiteral('true').should.equal(true);
        lexical.isLiteral('TrUE').should.equal(true);
        lexical.isLiteral('false').should.equal(true);
    });

    it('should test number literal', function() {
        lexical.isLiteral('2.3').should.equal(true);
        lexical.isLiteral('.3').should.equal(true);
        lexical.isLiteral('-3.').should.equal(true);
        lexical.isLiteral('23').should.equal(true);
    });

    it("should test range literal", function() {
        lexical.isRange("(12..32)").should.equal(true);
        lexical.isRange("(12..foo)").should.equal(true);
        lexical.isRange("(foo.bar..foo)").should.equal(true);
    });

    it('should test string literal', function() {
        lexical.isLiteral('""').should.equal(true);
        lexical.isLiteral('"a\'b"').should.equal(true);
        lexical.isLiteral("''").should.equal(true);
        lexical.isLiteral("'a bcd'").should.equal(true);
    });

    describe('.isVariable()', function() {
        it('should return true for foo', function() {
            lexical.isVariable("foo").should.equal(true);
        });
        it('should return true for.bar.foo', function() {
            lexical.isVariable("foo.bar.foo").should.equal(true);
        });
        it('should return true for foo[0].b', function() {
            lexical.isVariable("foo[0].b").should.equal(true);
        });
        it('should return true for 0a', function() {
            lexical.isVariable("0a").should.equal(true);
        });
        it('should return true for foo[a.b]', function() {
            lexical.isVariable("foo[a.b]").should.equal(true);
        });
        it('should return true for foo[a.b]', function() {
            lexical.isVariable("foo['a[0]']").should.equal(true);
        });
        it('should return true for "var-1"', function() {
            lexical.isVariable("var-1").should.equal(true);
        });
        it('should return true for "-var"', function() {
            lexical.isVariable("-var").should.equal(true);
        });
        it('should return true for "var-"', function() {
            lexical.isVariable("var-").should.equal(true);
        });
        it('should return true for "3-4"', function() {
            lexical.isVariable("3-4").should.equal(true);
        });
    });

    it('should test none literal', function() {
        lexical.isLiteral('2a').should.equal(false);
        lexical.isLiteral('"x').should.equal(false);
        lexical.isLiteral('a2').should.equal(false);
    });

    it('should test none variable', function() {
        lexical.isVariable("a.").should.equal(false);
        lexical.isVariable(".b").should.equal(false);
        lexical.isVariable(".").should.equal(false);
        lexical.isVariable("[0][12].bar[0]").should.equal(false);
    });

    it('should parse boolean literal', function() {
        lexical.parseLiteral('true').should.equal(true);
        lexical.parseLiteral('TrUE').should.equal(true);
        lexical.parseLiteral('false').should.equal(false);
    });

    it('should parse number literal', function() {
        lexical.parseLiteral('2.3').should.equal(2.3);
        lexical.parseLiteral('.32').should.equal(0.32);
        lexical.parseLiteral('-23.').should.equal(-23);
        lexical.parseLiteral('23').should.equal(23);
    });

    it('should parse string literal', function() {
        lexical.parseLiteral('"ab\'c"').should.equal("ab\'c");
    });

    describe('.matchValue()', function(){
        it('should match -5-5', function() {
            var match = lexical.matchValue('-5-5');
            expect(match && match[0]).to.equal('-5-5');
        });
        it('should match 4-3', function() {
            var match = lexical.matchValue('4-3');
            expect(match && match[0]).to.equal('4-3');
        });
        it('should match 4-3', function() {
            var match = lexical.matchValue('4-3');
            expect(match && match[0]).to.equal('4-3');
        });
        it('should match var-1', function() {
            var match = lexical.matchValue('var-1');
            expect(match && match[0]).to.equal('var-1');
        });
    });
});
