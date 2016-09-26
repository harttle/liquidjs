const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/capture', function() {
    var liquid = Liquid();

    it('should support capture 1', function() {
        var src = '{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}';
        return expect(liquid.parseAndRender(src))
            .to.eventually.equal('A');
    });
    it('should support capture 2', function() {
        var src = '{% capture = %}{%endcapture%}';
        return expect(liquid.parseAndRender(src))
            .to.be.rejectedWith(/= not valid identifier/);
    });

    it('should throw when for capture closed', function() {
        var src = '{%capture c%}{{c}}';
        return expect(liquid.parseAndRender(src))
            .to.be.rejectedWith(/tag .* not closed/);
    });
});
