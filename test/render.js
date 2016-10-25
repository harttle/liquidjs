const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = chai.should();
const expect = chai.expect;
const sinonChai = require("sinon-chai");
const sinon = require("sinon");

chai.use(sinonChai);
chai.use(chaiAsPromised);

var tag = require('../src/tag.js')();
var Scope = require('../src/scope.js');
var filter = require('../src/filter')();
var Render = require('../src/render.js');
var Template = require('../src/parser.js')(tag, filter);

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

    describe('.renderTemplates()', function(){
        it('should throw when scope undefined', function() {
            expect(function(){
                render.renderTemplates([]);
            }).to.throw(/scope undefined/);
        });

        it('should render html', function() {
            return render.renderTemplates([{type: 'html', value: '<p>'}], scope).should.eventually.equal('<p>');
        });
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

    describe('.evalOutput()', function(){
        it('should throw when scope undefined', function() {
            expect(function(){
                render.evalOutput();
            }).to.throw(/scope undefined/);
        });
        it('should eval output', function() {
            filter.register('date', (l, r) => l + r);
            filter.register('time', (l, r) => l + 3 * r);
            var tpl = Template.parseOutput('foo.bar[0] | date: "b" | time:2');
            expect(render.evalOutput(tpl, scope)).to.equal('ab6');
        });
    });
});
