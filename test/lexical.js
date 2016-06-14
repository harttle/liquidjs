var chai = require("chai");
var should = chai.should();
chai.use(require("chai-as-promised"));

var identifier = require('../lexical.js');

describe('identifier', function() {
    it('should test boolean literal', function() {
        identifier.isLiteral('true').should.equal(true);
        identifier.isLiteral('TrUE').should.equal(true);
        identifier.isLiteral('false').should.equal(true);
    });

    it('should test number literal', function() {
        identifier.isLiteral('2.3').should.equal(true);
        identifier.isLiteral('.3').should.equal(true);
        identifier.isLiteral('3.').should.equal(true);
        identifier.isLiteral('23').should.equal(true);
    });

    it('should test string literal', function() {
        identifier.isLiteral('""').should.equal(true);
        identifier.isLiteral('"a\'b"').should.equal(true);
        identifier.isLiteral("''").should.equal(true);
        identifier.isLiteral("'a bcd'").should.equal(true);
    });

    it("should test range literal", function() {
        identifier.isLiteral("(12..32)").should.equal(true);
    });

    it("should test variable", function() {
        identifier.isVariable("foo").should.equal(true);
        identifier.isVariable("foo.bar.foo").should.equal(true);
        identifier.isVariable("foo[0].b").should.equal(true);
    });

    it('should test none literal', function() {
        identifier.isLiteral('2a').should.equal(false);
        identifier.isLiteral('"x').should.equal(false);
        identifier.isLiteral('a2').should.equal(false);
    });

    it('should test none variable', function() {
        identifier.isVariable("a.").should.equal(false);
        identifier.isVariable(".b").should.equal(false);
        identifier.isVariable(".").should.equal(false);
        identifier.isVariable("0a").should.equal(false);
        identifier.isVariable("[0][12].bar[0]").should.equal(false);
    });

    it('should parse boolean literal', function() {
        identifier.parseLiteral('true').should.equal(true);
        identifier.parseLiteral('TrUE').should.equal(true);
        identifier.parseLiteral('false').should.equal(false);
    });

    it('should parse number literal', function() {
        identifier.parseLiteral('2.3').should.equal(2.3);
        identifier.parseLiteral('.32').should.equal(0.32);
        identifier.parseLiteral('23.').should.equal(23);
        identifier.parseLiteral('23').should.equal(23);
    });

    it('should parse string literal', function() {
        identifier.parseLiteral('"ab\'c"').should.equal("ab\'c");
    });

    it("should parse range literal", function() {
        var arr = identifier.parseLiteral("(12..32)");
        arr.length.should.equal(20);
        arr[0].should.equal(12);
        arr[1].should.equal(13);
        arr[19].should.equal(31);
    });
});
