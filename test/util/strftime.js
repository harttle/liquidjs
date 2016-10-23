const chai = require("chai");
const expect = chai.expect;

var t = require('../../src/util/strftime.js');

describe('util/strftime', function() {
    var now = new Date('2016-10-23T16:15:23');
    it('should format week by %U', function() {
        expect(t(now, '%U')).to.equal('43');
    });
    it('should format GMT string', function() {
        expect(t(now, '%Y-%m-%dT%H:%M:%S')).to.equal('2016-10-24T00:15:23');
    });
});
