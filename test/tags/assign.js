const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/assign', function() {
    var liquid = Liquid();
    it('should support assign 1', function() {
        var src = '{% assign foo="bar" %}{{foo}}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('bar');
    });
    it('should support assign 2', function() {
        var src = '{% assign foo=(1..3) %}{{foo}}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('[1,2,3]');
    });
    it('should support assign 3', function() {
        var src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('A');
    });
});
