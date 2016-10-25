var chai = require("chai");
var should = chai.should();
var expect = chai.expect;

var tokenizer = require('../src/tokenizer.js');

describe('tokenizer', function() {
    it('should handle plain HTML', function() {
        var html = '<html><body><p>Lorem Ipsum</p></body></html>';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(1);
        tokens[0].value.should.equal(html);
        tokens[0].type.should.equal('html');
    });
    it('should throw when non-string passed in', function() {
        expect(function() {
            tokenizer.parse({});
        }).to.throw('illegal input type');
    });
    it('should handle tag syntax', function() {
        var html = '<p>{% for p in a[1]%}</p>';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(3);
        tokens[1].type.should.equal('tag');
        tokens[1].value.should.equal('for p in a[1]');
    });
    it('should handle output syntax', function() {
        var html = '<p>{{foo | date: "%Y-%m-%d"}}</p>';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(3);
        tokens[1].type.should.equal('output');
        tokens[1].value.should.equal('foo | date: "%Y-%m-%d"');
    });
    it('should handle successive outputs and tags', function() {
        var html = '{{foo}}{{bar}}{%foo%}{%bar%}';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(4);
        tokens[0].type.should.equal('output');
        tokens[3].type.should.equal('tag');

        tokens[1].value.should.equal('bar');
        tokens[2].value.should.equal('foo');
    });
    it('should keep white spaces and newlines', function() {
        var html = '{{foo}}\n{%bar %}  \n {{alice}}';
        var tokens = tokenizer.parse(html);
        expect(tokens.length).to.equal(5);
        expect(tokens[1].type).to.equal('html');
        expect(tokens[1].raw).to.equal('\n');
        expect(tokens[3].type).to.equal('html');
        expect(tokens[3].raw).to.equal('  \n ');
    });
});
