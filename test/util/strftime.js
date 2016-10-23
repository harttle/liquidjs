const chai = require("chai");
const expect = chai.expect;

var t = require('../../src/util/strftime.js');

describe('util/strftime', function() {
    var now = new Date('2016-10-23T16:15:23');
    it('should format week by %U', function() {
        expect(t(now, '%U')).to.equal('43');
    });
    it('should format locale date string', function() {
        expect(t(now, '%Y-%m-%d')).to.equal(now.toLocaleDateString());
    });
    it('should format locale date string', function() {
        expect(t(now, '%H:%M:%S')).to.equal(now.toLocaleTimeString());
    });
});
