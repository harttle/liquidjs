var chai = require("chai");
var expect = chai.expect;
var engine = require('..')(), ctx;
const mock = require('mock-fs');

function test(promise, cb){
    return promise
        .then((result) => {
            return cb({});
        })
        .catch((error) => {
            return cb(error);
        });
}

describe('error', function() {

    it('should throw TokenizationError when tag illegal', function() {
        return test(engine.parseAndRender('{% -a %}', {}), function(err){
            expect(err.name).to.equal('TokenizationError');
            expect(err.message).to.equal('illegal tag: {% -a %}');
            expect(err.input).to.equal('{% -a %}');
            expect(err.line).to.equal(1);
        });
    });

    it('should throw correct error info', function() {
        return test(engine.parseAndRender('{%if true%}\naaa{%endif%}\n{% -a %}\n3', {}), function(err){
            expect(err.input).to.equal('{% -a %}');
            expect(err.line).to.equal(3);
        });
    });

    it('should throw correct error info for files', function() {
        mock({
            "/foo.html": '<html>\n<head>\n\n{% raw %}\n\n'
        });
        return test(engine.renderFile('/foo.html', {}), function(err){
            expect(err.input).to.equal('{% raw %}');
            expect(err.line).to.equal(4);
            expect(err.file).to.equal('/foo.html');
        });
    });

    it('should throw ParseError when tag not exist', function() {
        return test(engine.parseAndRender('{% a %}', {}), function(err){
            expect(err.name).to.equal('ParseError');
            expect(err.message).to.equal('tag a not found');
            expect(err.input).to.equal('{% a %}');
            expect(err.line).to.equal(1);
        });
    });

    it('should throw ParseError when tag not closed', function() {
        return test(engine.parseAndRender('{% if %}', {}), function(err){
            expect(err.name).to.equal('ParseError');
            expect(err.message).to.equal('tag {% if %} not closed');
            expect(err.input).to.equal('{% if %}');
            expect(err.line).to.equal(1);
        });
    });

});
