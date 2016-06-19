const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')(),
    ctx;

function test(src, dst) {
    ctx = {
        date: new Date(),
        foo: 'bar',
        arr: [-2, 'a'],
        obj: {
            foo: 'bar'
        },
        posts: [{
            category: 'foo'
        }, {
            category: 'bar'
        }]
    };
    expect(liquid.render(src, ctx)).to.equal(dst);
}

describe('liquid', function() {
    it('should output object', function() {
        test('{{obj}}', '{"foo":"bar"}');
    });
    it('should output array', function() {
        test('{{arr}}', '[-2,"a"]');
    });
});
