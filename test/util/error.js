const chai = require("chai");
const expect = chai.expect;
const mock = require('mock-fs');
chai.use(require("chai-as-promised"));

var engine = require('../..')();
var strictEngine = require('../..')({
    strict_variables: true,
    strict_filters: true
});

describe('error', function() {

    describe('TokenizationError', function() {
        it('should throw TokenizationError when tag illegal', function() {
            return engine.parseAndRender('{% . a %}', {}).catch(function(err) {
                expect(err.name).to.equal('TokenizationError');
                expect(err.message).to.equal('illegal tag: {% . a %}');
                expect(err.input).to.equal('{% . a %}');
                expect(err.line).to.equal(1);
            });
        });
        it('should throw TokenizationError when tag syntax illegal', function() {
            return engine.parseAndRender('{% . a }', {}).catch(function(err) {
                expect(err.name).to.equal('TokenizationError');
                expect(err.message).to.equal('illegal tag: {% . a }');
                expect(err.input).to.equal('{% . a }');
                expect(err.line).to.equal(1);
            });
        });
        it('should throw TokenizationError when filter syntax illegal', function() {
            return engine.parseAndRender('{{ a|| }}', {}).catch(function(err) {
                expect(err.name).to.equal('TokenizationError');
                expect(err.message).to.equal('{{ a|| }');
                expect(err.input).to.equal('{{ a|| }');
                expect(err.line).to.equal(1);
            });
        });
    });

    describe('TypeError', function() {
        it('should not throw when variable undefined by default', function() {
            return expect(engine.parseAndRender('X{{a}}Y')).to.eventually.equal('XY');
        });
        it('should throw TypeError when variable not defined', function() {
            return expect(strictEngine.parseAndRender('{{a}}')).to.eventually
                .be.rejected
                .then(function(e){
                    expect(e).to.have.property('name', 'TypeError');
                    expect(e).to.have.property('message', 'undefined variable: a');
                });
        });
        it('should throw TypeError when filter not defined', function() {
            return expect(strictEngine.parseAndRender('{{1 | a}}')).to.eventually
                .be.rejected
                .then(function(e){
                    expect(e).to.have.property('name', 'TypeError');
                    expect(e).to.have.property('message', 'undefined filter: a');
                });
        });
    });

    describe('ParseError', function() {
        it('should throw correct error info', function() {
            var src = '{%if true%}\naaa{%endif%}\n{% -a %}\n3';
            return engine.parseAndRender(src).catch(function(err) {
                expect(err.name).to.equal('ParseError');
                expect(err.input).to.equal('{% -a %}');
                expect(err.line).to.equal(3);
            });
        });
        it('should throw correct error info for files', function() {
            mock({
                "/foo.html": '<html>\n<head>\n\n{% raw %}\n\n'
            });
            return engine.renderFile('/foo.html').catch(function(err) {
                mock.restore();
                expect(err.name).to.equal('ParseError');
                expect(err.input).to.equal('{% raw %}');
                expect(err.line).to.equal(4);
                expect(err.file).to.equal('/foo.html');
            });
        });

        it('should throw ParseError when tag not exist', function() {
            return engine.parseAndRender('{% a %}').catch(function(err) {
                expect(err.name).to.equal('ParseError');
                expect(err.message).to.equal('tag a not found');
                expect(err.input).to.equal('{% a %}');
                expect(err.line).to.equal(1);
            });
        });

        it('should throw ParseError when tag not closed', function() {
            return engine.parseAndRender('{% if %}').catch(function(err) {
                expect(err.name).to.equal('ParseError');
                expect(err.message).to.equal('tag {% if %} not closed');
                expect(err.input).to.equal('{% if %}');
                expect(err.line).to.equal(1);
            });
        });
    });
});
