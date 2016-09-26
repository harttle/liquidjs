// temporary
const Promise = require('any-promise');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = chai.should();
const expect = chai.expect;
const Liquid = require('..');
const mock = require('mock-fs');

chai.use(chaiAsPromised);

var liquid = Liquid({
        root: '/',
        extname: '.html'
    }),
    ctx, src, dst;

function test(src, dst) {
    return liquid.parseAndRender(src, ctx)
        .then((result) => {
            return expect(result).to.equal(dst);
        });
}

function testThrow(src, pattern) {
    return liquid.parseAndRender(src, ctx).should.eventually.be.rejectedWith(pattern);
}

describe('tags', function() {
    beforeEach(function() {
        ctx = {
            one: 1,
            two: 2,
            leq: '<=',
            empty: '',
            foo: 'bar',
            arr: [-2, 'a'],
            alpha: ['a', 'b', 'c'],
            emptyArray: [],
            person: {
                firstName: 'Joe',
                lastName: 'Shmoe',
                address: {
                    city: 'Dallas'
                }
            }
        };
        mock({
            '/default-layout.html': 'foo{% block %}Default{% endblock %}foo',
            '/multi-blocks-layout.html': 'foo{% block "a"%}{% endblock %}{% block b%}{%endblock%}foo',
            '/multi-blocks.html': '{% layout "multi-blocks-layout" %}{%block a%}aaa{%endblock%},{%block b%};{%block c%}ccc{%endblock%};{%endblock%}',
            '/files/foo.html': 'foo',
            '/current.html': 'bar{% include "foo.html" %}bar',
            '/relative.html': 'bar{% include "../files/foo.html" %}bar',
            '/foo.html': 'FOO',
            '/user.html': '{{name}} : {{role}} : {{alias}}',
            '/color.html': 'color:{{color}}, shape:{{shape}}',
            '/with.html': '{% include "color" with "red", shape: "rect" %}',
            '/scope.html': '{% assign shape="triangle" %}{% assign color="yellow" %}{% include "color.html" %}',
            '/hash.html': '{% assign name="harttle" %}{% include "user.html", role: "admin", alias: name %}',
            '/personInfo.html': 'This is a person {% include "card.html" %}',
            '/card.html': '<p>{{person.firstName}} {{person.lastName}}<br/>{% include "address" %}</p>',
            '/address.html': 'City: {{person.address.city}}'
        });
    });
    afterEach(function() {
        mock.restore();
    });

    it('should support assign 1', function() { return test('{% assign foo="bar" %}{{foo}}', 'bar'); });
    it('should support assign 2', function() { return test('{% assign foo=(1..3) %}{{foo}}', '[1,2,3]'); });
    it('should support assign 3', function() { return test('{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}', 'A'); });

    it('should support raw 1', function() { return testThrow('{% raw%}', /{% raw%} not closed/); });
    it('should support raw 2', function() { return test('{% raw %}{{ 5 | plus: 6 }}{% endraw %} is equal to 11.', '{{ 5 | plus: 6 }} is equal to 11.'); });
    it('should support raw 3', function() { return test('{% raw %}\n{{ foo}} \n{% endraw %}', '\n{{ foo}} \n'); });


    it('should support comment 1', function() { return testThrow('{% comment %}{% raw%}', /{% comment %} not closed/); });
    it('should support comment 2', function() { return test('My name is {% comment %}super{% endcomment %} Shopify.', 'My name is  Shopify.'); });
    it('should support comment 3', function() { return test('{% comment %}\n{{ foo}} \n{% endcomment %}', ''); });

    it('should support case 1', function() { return testThrow('{% case "foo"%}', /{% case "foo"%} not closed/); });
    it('should support case 2', function() { return test('{% case "foo"%}' +
                                                        '{% when "foo" %}foo{% when "bar"%}bar' +
                                                        '{%endcase%}', 'foo'); });
    it('should support case 3', function() { return test('{% case empty %}' +
                                                        '{% when "foo" %}foo{% when ""%}bar' +
                                                        '{%endcase%}', 'bar'); });
    it('should support case 4', function() { return test('{% case false %}' +
                                                        '{% when "foo" %}foo{% when ""%}bar' +
                                                        '{%endcase%}', ''); });
    it('should support case 5', function() { return test('{% case "a" %}' +
                                                        '{% when "b" %}b{% when "c"%}c{%else %}d' +
                                                        '{%endcase%}', 'd'); });

    it('should support if 1', function() { return testThrow('{% if false%}yes', /tag {% if false%} not closed/); });
    it('should support if 2', function() { return test('{%if emptyArray%}a{%endif%}', ''); });
    it('should support if 3', function() { return test('{% if 2==3 %}yes{%else%}no{%endif%}', 'no'); });
    it('should support if 4', function() { return test('{% if 1>=2 and one<two %}a{%endif%}', ''); });
    it('should support if 5', function() { return test('{% if one!=two %}yes{%else%}no{%endif%}', 'yes'); });
    it('should support if 6', function() { return test('{% if false %}1{%elsif true%}2{%else%}3{%endif%}', '2'); });
    it('should support if 7', function() { return test('{%if false%}{%if true%}{%else%}a{%endif%}{%endif%}', ''); });

    it('should support unless 1', function() { return test('{% unless 1 %}yes{%else%}no{%endunless%}', 'no'); });
    it('should support unless 2', function() { return testThrow('{% unless 1>2 %}yes', /tag {% unless 1>2 %} not closed/); });
    it('should support unless 3', function() { return test('{% unless 1>2 %}yes{%endunless%}', 'yes'); });
    it('should support unless 4', function() { return test('{% unless true %}{%endunless%}', ''); });

    it('should support capture 1', function() { return test('{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}', 'A'); });
    it('should support capture 2', function() { return testThrow('{% capture = %}{%endcapture%}', /= not valid identifier/); });

    it('should throw when for capture closed', function() {
        return testThrow('{%capture c%}{{c}}', /tag .* not closed/);
    });

    it('should support for', function() {
        return test('{%for c in alpha%}{{c}}{%endfor%}', 'abc');
    });

    it('should throw when for not closed', function() {
        return testThrow('{%for c in alpha%}{{c}}', /tag .* not closed/);
    });

    it('should support for else', function() {
        return test('{%for c in ""%}a{%else%}b{%endfor%}', 'b');
    });

    it('should support for with forloop', function() {
        src = '{%for c in alpha%}' +
            '{{forloop.first}}.{{forloop.index}}.{{forloop.index0}}.' +
            '{{forloop.last}}.{{forloop.length}}.' +
            '{{forloop.rindex}}.{{forloop.rindex0}}' +
            '{{c}}\n' +
            '{%endfor%}';
        dst = 'true.1.0.false.3.3.2a\n' +
            'false.2.1.false.3.2.1b\n' +
            'false.3.2.true.3.1.0c\n';
        return test(src, dst);
    });

    it('should support for with continue', function() {
        src = '{% for i in (1..5) %}' +
            '{% if i == 4 %}{% continue %}' +
            '{% else %}{{ i }}' +
            '{% endif %}' +
            '{% endfor %}';
        return test(src, '1235');
    });
    it('should support for with break', function() {
        src = '{% for i in (one..5) %}' +
            '{% if i == 4 %}{% break %}{% endif %}' +
            '{{ i }}' +
            '{% endfor %}';
        return test(src, '123');
    });

    it('should support for with limit', function() {
        src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}';
        return test(src, '12');
    });
    it('should support for with limit and offset', function() {
        src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}';
        return test(src, '67');
    });

    it('should support for reversed', function() {
        src = '{% for i in (1..5) limit:2 reversed %}{{ i }}{% endfor %}';
        return test(src, '21');
    });

    it('should support cycle', function() {
        src = "{% cycle '1', '2', '3' %}";
        return test(src + src + src + src, '1231');
    });

    it('should throw when cycle candidates empty', function() {
        return testThrow('{%cycle%}', /empty candidates/);
    });

    it('should support cycle in for block', function() {
        src = '{% for i in (1..5) %}{% cycle one, "e"%}{% endfor %}';
        return test(src, '1e1e1');
    });

    it('should support cycle group', function() {
        src = "{% cycle one: '1', '2', '3'%}" +
            "{% cycle 1: '1', '2', '3'%}" +
            "{% cycle 2: '1', '2', '3'%}";
        return test(src, '121');
    });

    it('should support increment 1', function() { return test('{% increment foo %}{%increment foo%}{{foo}}', '2'); });
    it('should support increment 2', function() { return test('{% increment one %}{{one}}', '2'); });

    it('should support decrement 1', function() { return test('{% decrement foo %}{%decrement foo%}{{foo}}', '-2'); });
    it('should support decrement 2', function() { return test('{% decrement one %}{{one}}', '0'); });

    it('should support tablerow', function() {
        src = '{% tablerow i in alpha cols:2 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">a</td><td class="col2">b</td></tr>' +
            '<tr class="row2"><td class="col1">c</td></tr>' +
            '</table>';
        return test(src, dst);
    });

    it('should support empty tablerow', function() {
        src = '{% tablerow i in (1..0) cols:2 %}{{ i }}{% endtablerow %}';
        dst = '<table></table>';
        return test(src, dst);
    });

    it('should throw when tablerow not closed', function() {
        src = '{% tablerow i in (1..0) cols:2 %}{{ i }}';
        return testThrow(src, /tag .* not closed/);
    });

    it('should support tablerow with range', function() {
        src = '{% tablerow i in (1..5) cols:2 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
            '<tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>' +
            '<tr class="row3"><td class="col1">5</td></tr>' +
            '</table>';
        return test(src, dst);
    });

    it('tablerow should throw on illegal cols 1', function() {
        return testThrow('{% tablerow i in (1..5) cols:0 %}{{ i }}{% endtablerow %}',
            /illegal cols: 0/);
    });
    it('tablerow should throw on illegal cols 2', function() {
        return testThrow('{% tablerow i in (1..5) %}{{ i }}{% endtablerow %}',
            /illegal cols: undefined/);
    });

    it('should support tablerow with limit', function() {
        src = '{% tablerow i in (1..5) cols:2 limit:3 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
            '<tr class="row2"><td class="col1">3</td></tr>' +
            '</table>';
        return test(src, dst);
    });

    it('should support tablerow with offset', function() {
        src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>' +
            '</table>';
        return test(src, dst);
    });

    it('should support include', function() {
        return liquid.renderFile('/current.html', ctx).should.eventually.equal('barFOObar');
    });

    it('should support include with relative path', function() {
        return liquid.renderFile('relative.html', ctx).should.eventually.equal('barfoobar');
    });

    it('should support include: hash list', function() {
        return liquid.renderFile('hash.html', ctx).should.eventually.equal('harttle : admin : harttle');
    });

    it('should support include: parent scope', function() {
        return liquid.renderFile('scope.html', ctx).should.eventually.equal('color:yellow, shape:triangle');
    });

    it('should support include: with', function() {
        var filepath = 'with.html';
        var dst = 'color:red, shape:rect';
        return liquid.renderFile(filepath, ctx).should.eventually.equal(dst);
    });

    it('should support nested includes', function() {
        //expect(liquid.renderFile('personInfo.html', ctx)).to.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>');
        return liquid.renderFile('personInfo.html', ctx).should.eventually.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>')
    });

    it('should throw when block not closed', function() {
        src = '{% layout "default-layout" %}{%block%}bar';
        return testThrow(src, /tag {%block%} not closed/);
    });
    it('should support layout', function() {
        src = '{% layout "default-layout" %}{%block%}bar{%endblock%}';
        return test(src, 'foobarfoo');
    });
    it('should support layout: multiple blocks', function() {
        src = '{% layout "multi-blocks-layout" %}' +
            '{%block a%}bara{%endblock%}' +
            '{%block b%}barb{%endblock%}';
        return test(src, 'foobarabarbfoo');
    });
    it('should support layout: nested 1', function() {
        src = '{% layout "multi-blocks" %}{% block a%}A{%endblock%}{%block c%}C{%endblock%}';
        return test(src, 'fooA;C;foo');
    });
    it('should support layout: nested 2', function() {
        src = '{% layout "multi-blocks" %}{%block c%}C{%endblock%}';
        return test(src, 'fooaaa;C;foo');
    });
});
