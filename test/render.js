const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(sinonChai);

var tag = require('../tag.js')();
var Scope = require('../scope.js');
var filter = require('../filter')();
var Render = require('../render.js');
var Template = require('../parser.js')(tag, filter);

describe('render', function() {
    var scope, render;

    beforeEach(function() {
        scope = Scope.factory({
            foo: {
                bar: ['a', 2]
            }
        });
        filter.clear();
        tag.clear();
        render = Render();
    });

    it('should render html', function() {
        expect(render.renderTemplates([{
            type: 'html',
            value: '<p>'
        }], scope)).to.equal('<p>');
    });

    it('should eval filter with correct arguments', function() {
        var date = sinon.stub().returns('y');
        var time = sinon.spy();
        filter.register('date', date);
        filter.register('time', time);
        var tpl = Template.parseOutput('foo.bar[0] | date: "b" | time:2');
        render.evalOutput(tpl, scope);
        expect(date).to.have.been.calledWith('a', 'b');
        expect(time).to.have.been.calledWith('y', 2);
    });

    it('should eval output', function() {
        filter.register('date', (l, r) => l + r);
        filter.register('time', (l, r) => l + 3 * r);
        var tpl = Template.parseOutput('foo.bar[0] | date: "b" | time:2');
        expect(render.evalOutput(tpl, scope)).to.equal('ab6');
    });
});
