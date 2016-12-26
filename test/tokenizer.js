const chai = require("chai");
const parse = require('../src/tokenizer.js').parse;
const whiteSpaceCtrl = require('../src/tokenizer.js').whiteSpaceCtrl;

const should = chai.should();
const expect = chai.expect;

describe('tokenizer', function() {
    describe('parse', function() {
        it('should handle plain HTML', function() {
            var html = '<html><body><p>Lorem Ipsum</p></body></html>';
            var tokens = parse(html);

            tokens.length.should.equal(1);
            tokens[0].value.should.equal(html);
            tokens[0].type.should.equal('html');
        });
        it('should throw when non-string passed in', function() {
            expect(function() {
                parse({});
            }).to.throw('illegal input type');
        });
        it('should handle tag syntax', function() {
            var html = '<p>{% for p in a[1]%}</p>';
            var tokens = parse(html);

            tokens.length.should.equal(3);
            tokens[1].type.should.equal('tag');
            tokens[1].value.should.equal('for p in a[1]');
        });
        it('should handle output syntax', function() {
            var html = '<p>{{foo | date: "%Y-%m-%d"}}</p>';
            var tokens = parse(html);

            tokens.length.should.equal(3);
            tokens[1].type.should.equal('output');
            tokens[1].value.should.equal('foo | date: "%Y-%m-%d"');
        });
        it('should handle successive outputs and tags', function() {
            var html = '{{foo}}{{bar}}{%foo%}{%bar%}';
            var tokens = parse(html);

            tokens.length.should.equal(4);
            tokens[0].type.should.equal('output');
            tokens[3].type.should.equal('tag');

            tokens[1].value.should.equal('bar');
            tokens[2].value.should.equal('foo');
        });
        it('should keep white spaces and newlines', function() {
            var html = '{{foo}}\n{%bar %}  \n {{alice}}';
            var tokens = parse(html);
            expect(tokens.length).to.equal(5);
            expect(tokens[1].type).to.equal('html');
            expect(tokens[1].raw).to.equal('\n');
            expect(tokens[3].type).to.equal('html');
            expect(tokens[3].raw).to.equal('  \n ');
        });
    });
    describe('whitespace control', function() {
        it('should strip left whitespaces', function() {
            expect(whiteSpaceCtrl('  {{- foo }}')).to.equal('{{- foo }}');
        });
        it('should strip right whitespaces', function() {
            expect(whiteSpaceCtrl('{{ foo -}}  ')).to.equal('{{ foo -}}');
        });
        it('should not strip left when not specified', function() {
            expect(whiteSpaceCtrl(' {%foo-%} ')).to.equal(' {%foo-%}');
        });
        it('should not strip right when not specified', function() {
            expect(whiteSpaceCtrl(' {{-foo}} ')).to.equal('{{-foo}} ');
        });
        it('should strip all blank characters', function() {
            expect(whiteSpaceCtrl('\t\r{{-foo-}}\n \n')).to.equal('{{-foo-}}');
        });
        it('should stop stripping when encountered normal chars', () =>
            expect(whiteSpaceCtrl('\ta\r{{-foo-}} b ')).to.equal('\ta{{-foo-}}b '));
        it('should strip whitespaces when set trim_left', function() {
            expect(whiteSpaceCtrl('  {{foo}} ', {
                trim_left: true
            })).to.equal('{{foo}} ');
        });
        it('should strip whitespaces when set trim_right', function() {
            expect(whiteSpaceCtrl('  {{foo}} ', {
                trim_right: true
            })).to.equal('  {{foo}}');
        });
        it('markup should has priority over options', function() {
            expect(whiteSpaceCtrl('  {{-foo}} ', {
                trim_left: false
            })).to.equal('{{-foo}} ');
        });
        it('should support a mix of markup and options', function() {
            expect(whiteSpaceCtrl('  {%-foo%} ', {
                trim_left: true,
                trim_right: true
            })).to.equal('{%-foo%}');
        });
    });
});
