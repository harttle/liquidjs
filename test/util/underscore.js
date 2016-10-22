const chai = require("chai");
const expect = chai.expect;
const _ = require('../../src/util/underscore.js');

describe('util/underscore', function() {
    describe('.isString()', function(){
        it('should return true for literal string', function(){
            expect(_.isString('foo')).to.be.true;
        });
        it('should return true String instance', function(){
            expect(_.isString(new String('foo'))).to.be.true;
        });
        it('should return false for 123 ', function(){
            expect(_.isString(123)).to.be.false;
        });
    });
});
