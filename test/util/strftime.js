const chai = require("chai");
const expect = chai.expect;

var t = require('../../src/util/strftime.js');

describe('util/strftime', function() {
    var now = new Date('2016-10-24T00:15:23+08:00');
    it('should format week by %U', function() {
        expect(t(now, '%U')).to.equal('43');
    });
    it('should format locale date string', function() {
        var date = now.toLocaleDateString('zh-CN');
        expect(t(now, '%Y-%m-%d')).to.equal(date);
    });
    it('should format locale date string', function() {
        var time = now.toLocaleTimeString('zh-CN');
        expect(t(now, '%H:%M:%S')).to.equal(time);
    });
});
