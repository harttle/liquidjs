const chai = require("chai");
const sinon = require('sinon');
const expect = chai.expect;
chai.use(require("sinon-chai"));

var _ = require('../../src/util/underscore.js');

describe('util/underscore', function() {
    describe('.isString()', function() {
        it('should return true for literal string', function() {
            expect(_.isString('foo')).to.be.true;
        });
        it('should return true String instance', function() {
            expect(_.isString(new String('foo'))).to.be.true;
        });
        it('should return false for 123 ', function() {
            expect(_.isString(123)).to.be.false;
        });
    });
    describe('.forOwn()', function() {
        it('should iterate all properties', function() {
            var spy = sinon.spy();
            var obj = {
                foo: "bar"
            };
            _.forOwn(obj, spy);
            expect(spy).to.have.been.calledWith('bar', 'foo', obj);
        });
        it('should not iterate over properties on prototype', function() {
            var spy = sinon.spy();
            var obj = Object.create({
                bar: 'foo'
            });
            obj.foo = 'bar';
            _.forOwn(obj, spy);
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWith('bar', 'foo', obj);
        });
    });
});
