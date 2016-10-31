const chai = require("chai");
const sinon = require('sinon');
const expect = chai.expect;
chai.use(require("chai-as-promised"));
chai.use(require("sinon-chai"));

var P = require('../../src/util/promise.js');

describe('util/promise', function() {
    describe('.someSeries()', function() {
        it('should resolve in series', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();
            return P
                .someSeries(
                    ['first', 'second'],
                    (item, idx) => new Promise(function(resolve, reject) {
                        if (idx === 0) {
                            setTimeout(function() {
                                spy1();
                                reject(new Error('first cb'));
                            }, 10);
                        } else {
                            spy2();
                            resolve('foo');
                        }
                    }))
                .then(() => expect(spy2).to.have.been.calledAfter(spy1));
        });
        it('should reject when all rejected', function() {
            var p = P.someSeries(['first', 'second', 'third'],
                item => Promise.reject(new Error(item)));
            return expect(p).to.be.rejectedWith("third");
        });
        it('should resolve the value that first callback resolved', () => {
            var p = P.someSeries(['first', 'second'],
                item => Promise.resolve(item));
            return expect(p).to.eventually.equal('first');
        });
        it('should not call rest of callbacks once resolved', () => {
            var spy = sinon.spy();
            return P.someSeries(['first', 'second'], (item, idx) => {
                    if (idx > 0) {
                        spy();
                    }
                    return Promise.resolve(item);
                })
                .then(() => expect(spy).to.not.have.been.called);
        });
    });
});
