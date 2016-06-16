const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(sinonChai);

var tag = require('../tag.js')();
var Scope = require('../scope.js');
var filter = require('../filter')();
var Render = require('../render.js')(filter, tag);
var render = Render.renderTemplates;
var evalExp = Render.evalExp;
var evalFilter = Render.evalFilter;

describe('render', function() {
    var scope;

    beforeEach(function() {
        scope = Scope.factory({
            one: 1,
            two: 2,
            x: 'XXX',
            foo: {
                bar: ['a', 2]
            }
        });
        filter.clear();
        tag.clear();
    });

    it('should render html', function() {
        expect(render([{
            type: 'html',
            value: '<p>'
        }], scope)).to.equal('<p>');
    });

    it('should eval filter with correct arguments', function() {
        var date = sinon.stub().returns('y');
        var time = sinon.spy();
        filter.register('date', date);
        filter.register('time', time);
        evalFilter('foo.bar[0] | date: "b" | time:2', scope);
        expect(date).to.have.been.calledWith('a', 'b');
        expect(time).to.have.been.calledWith('y', 2);
    });

    it('should eval filter', function() {
        filter.register('date', (l, r) => l + r);
        filter.register('time', (l, r) => l + 3 * r);
        expect(evalFilter('foo.bar[0] | date: "b" | time:2', scope)).to.equal('ab6');
    });

    it('should eval expression', function() {
        expect(evalExp('1<2', scope)).to.equal(true);
        expect(evalExp('2<=2', scope)).to.equal(true);
        expect(evalExp('one<=two', scope)).to.equal(true);
        expect(function() {
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
