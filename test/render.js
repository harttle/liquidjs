const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(sinonChai);

var tag = require('../tag.js')();
var Scope = require('../scope.js');
var filter = require('../filter')();
var Render = require('../render.js')(filter, tag);
var render = Render.render;
var evalExp = Render.evalExp;
var evalFilter = Render.evalFilter;

describe('render', function() {
    var scope, htmlToken, tagToken, filterToken;

    before(function() {
        scope = Scope.factory({
            one: 1,
            two: 2,
            x: 'XXX',
            foo: {
                bar: ['a', 2]
            }
        });
        tagToken = {
            type: 'tag',
            value: 'foo bar:x foo:"FOO" num:2.3',
            name: 'foo',
            args: 'bar:x foo:"FOO" num:2.3'
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
        expect(render([htmlToken], scope)).to.equal('<p>');
    });

    it('should render with tag function', function() {
        tag.register('foo', {
            render: x => 'X'
        });
        expect(render([tagToken], scope)).to.equal('X');
    });

    it('should call tag with correct arguments', function() {
        var spy = sinon.spy();
        tag.register('foo', { render: spy });
        render([tagToken], scope);
        expect(spy).to.have.been.calledWithMatch([], scope, tagToken, {
            bar: 'XXX',
            foo: 'FOO',
            num: 2.3
        });
    });

    it('should render with filter function', function() {
        filter.register('date', (l, r) => l + r);
        filter.register('time', (l, r) => l + 3*r);
        expect(render([filterToken], scope)).to.equal('ab6');
    });

    it('should call filter with correct arguments', function() {
        var date = sinon.stub().returns('y');
        var time = sinon.spy();
        filter.register('date', date);
        filter.register('time', time);
        render([filterToken], scope);
        expect(date).to.have.been.calledWith('a', 'b');
        expect(time).to.have.been.calledWith('y', 2);
    });

    it('should eval expression', function(){
        expect(evalExp('1<2', scope)).to.equal(true);
        expect(evalExp('2<=2', scope)).to.equal(true);
        expect(evalExp('one<=two', scope)).to.equal(true);
        expect(function(){
            evalExp('1 contains "x"', scope);
        }).to.throw();
        expect(evalExp('x contains "x"', scope)).to.equal(false);
        expect(evalExp('x contains "X"', scope)).to.equal(true);
        expect(evalExp('x contains z', scope)).to.equal(true);
        expect(evalExp('1<2 and x contains "x"', scope)).to.equal(false);
        expect(evalExp('1<2 or x contains "x"', scope)).to.equal(true);
        expect(evalExp('"<=" == "<="', scope)).to.equal(true);
    });
});
