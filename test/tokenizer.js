var chai = require("chai");
var should = chai.should();
chai.use(require("chai-as-promised"));

var tokenizer = require('../tokenizer.js');

describe('tokenizer', function() {
    it('should handle plain HTML', function() {
        var html = '<html><body><p>Lorem Ipsum</p></body></html>';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(1);
        tokens[0].value.should.equal(html);
        tokens[0].type.should.equal('html');
    });
    it('should handle tag syntax', function(){
        var html = '<p>{% for p in a[1]%}</p>';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(3);
        tokens[1].type.should.equal('tag');
        tokens[1].value.should.equal('for p in a[1]');
    });
    it('should handle output syntax', function(){
        var html = '<p>{{foo | date: "%Y-%m-%d"}}</p>';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(3);
        tokens[1].type.should.equal('output');
        tokens[1].value.should.equal('foo | date: "%Y-%m-%d"');
    });
    it('should handle successive output and tags', function(){
        var html = '{{foo}}{{bar}}{%foo%}{%bar%}';
        var tokens = tokenizer.parse(html);

        tokens.length.should.equal(4);
        tokens[0].type.should.equal('output');
        tokens[3].type.should.equal('tag');

        tokens[1].value.should.equal('bar');
        tokens[2].value.should.equal('foo');
    });
});
