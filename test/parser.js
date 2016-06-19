const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const should = chai.should();
const expect = chai.expect;

chai.use(sinonChai);

var filter = require('../filter.js')();
var tag = require('../tag.js')();
var Template = require('../parser.js');

describe('template', function() {
    var scope, template, add = (l, r) => l + r;

    beforeEach(function(){
        filter.clear();
        filter.register('add', add);

        tag.clear();
        template = Template(tag, filter);
    });

    it('should parse output string', function() {
        var tpl = template.parseOutput('foo');
        expect(tpl.type).to.equal('output');
        expect(tpl.initial).to.equal('foo');
        expect(tpl.filters).to.deep.equal([]);
    });

    it('should parse output string with a simple filter', function() {
        var tpl = template.parseOutput('foo | add: 3, "foo"');
        expect(tpl.initial).to.equal('foo');
        expect(tpl.filters.length).to.equal(1);
        expect(tpl.filters[0].filter).to.equal(add);
    });

    it('should parse output string with filters', function() {
        var tpl = template.parseOutput('foo | add: "|" | add');
        expect(tpl.initial).to.equal('foo');
        expect(tpl.filters.length).to.equal(2);
    });
});
