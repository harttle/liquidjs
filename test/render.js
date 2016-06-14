const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(sinonChai);

var tag = require('../tag.js')();
var context = require('../context.js');
var filter = require('../filter')();
var render = require('../render.js')(filter, tag).render;

describe('render', function() {
    var ctx, htmlToken, tagToken, filterToken;

    before(function() {
        ctx = context.factory({
            x: 'XXX',
            foo: {
                bar: ['a', 2]
            }
        });
        tagToken = {
            type: 'tag',
            value: 'foo bar:x foo:"FOO" num:2.3'
        };
        htmlToken = {
            type: 'html',
            value: '<p>'
        };
        filterToken = {
            type: 'output',
            value: 'foo.bar[0] | date: "b" | time:2'
        };
    });

    beforeEach(function(){
        filter.clear();
        tag.clear();
    });

    it('should render html', function() {
        expect(render([htmlToken], ctx)).to.equal('<p>');
    });

    it('should render with tag function', function() {
        tag.register('foo', {
            render: x => 'X'
        });
        expect(render([tagToken], ctx)).to.equal('X');
    });

    it('should call tag with correct arguments', function() {
        var spy = sinon.spy();
        tag.register('foo', { render: spy });
        render([tagToken], ctx);
        expect(spy).to.have.been.calledWithMatch([], ctx, tagToken.value, {
            bar: 'XXX',
            foo: 'FOO',
            num: 2.3
        });
    });

    it('should render with filter function', function() {
        filter.register('date', (l, r) => l + r);
        filter.register('time', (l, r) => l + 3*r);
        expect(render([filterToken], ctx)).to.equal('ab6');
    });

    it('should call filter with correct arguments', function() {
        var date = sinon.stub().returns('y');
        var time = sinon.spy();
        filter.register('date', date);
        filter.register('time', time);
        render([filterToken], ctx);
        expect(date).to.have.been.calledWith('a', 'b');
        expect(time).to.have.been.calledWith('y', 2);
    });
});
