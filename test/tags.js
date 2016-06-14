const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')();

var ctx = {
    foo: 'bar',
    arr: [-2, 'a']
};

describe('tags', function() {
    it('should support assign', function() {
        test('{% assign foo="bar"%}{{foo}}', 'bar');
    });
});

function test(src, dst){
    expect(liquid.render(src, ctx)).to.equal(dst);
}
