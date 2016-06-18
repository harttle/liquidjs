const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')(),
    ctx, src, dst;

function test(src, dst) {
    expect(liquid.render(src, ctx)).to.equal(dst);
}

function testThrow(src, pattern) {
    expect(function() {
        liquid.render(src, ctx);
    }).to.throw(pattern);
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
            emptyArray: []
        };
    });

    it('should support assign', function() {
        test('{% assign foo="bar" %}{{foo}}', 'bar');
        test('{% assign foo=(1..3) %}{{foo}}', '[1,2,3]');
        test('{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}', 'A');
    });

    it('should support case', function() {
        testThrow('{% case "foo"%}', /{% case "foo"%} not closed/);
        test('{% case "foo"%}' +
            '{% when "foo" %}foo{% when "bar"%}bar' +
            '{%endcase%}', 'foo');
        test('{% case empty %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}', 'bar');
        test('{% case false %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}', '');
        test('{% case "a" %}' +
            '{% when "b" %}b{% when "c"%}c{%else %}d' +
            '{%endcase%}', 'd');
    });

    it('should support if', function() {
        testThrow('{% if false%}yes', /tag {% if false%} not closed/);
        test('{%if emptyArray%}a{%endif%}', '');
        test('{% if 2==3 %}yes{%else%}no{%endif%}', 'no');
        test('{% if 1==2 and one<two %}a{%endif%}', '');
        test('{% if false %}yes{%else%}no{%endif%}', 'no');
        test('{% if false %}1{%elsif true%}2{%else%}3{%endif%}', '2');
        test('{%if false%}{%if true%}{%else%}a{%endif%}{%endif%}', '');
    });

    it('should support unless', function() {
        test('{% unless 1 %}yes{%else%}no{%endunless%}', 'no');
        testThrow('{% unless 1>2 %}yes', /tag {% unless 1>2 %} not closed/);
        test('{% unless 1>2 %}yes{%endunless%}', 'yes');
    });

    it('should support capture', function() {
        test('{% capture f %}{{"a" | capitalize}}{%endcapture%}{{f}}', 'A');
        testThrow('{% capture = %}{%endcapture%}', /= not valid identifier/);
    });

    it('should throw when for capture closed', function() {
        testThrow('{%capture c%}{{c}}', /tag .* not closed/);
    });

    it('should support for', function() {
        test('{%for c in alpha%}{{c}}{%endfor%}', 'abc');
    });

    it('should throw when for not closed', function() {
        testThrow('{%for c in alpha%}{{c}}', /tag .* not closed/);
    });

    it('should support for else', function() {
        test('{%for c in ""%}a{%else%}b{%endfor%}', 'b');
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
        test(src, dst);
    });

    it('should support for with continue and break', function() {
        src = '{% for i in (1..5) %}' +
            '{% if i == 4 %}{% continue %}' +
            '{% else %}{{ i }}' +
            '{% endif %}' +
            '{% endfor %}';
        test(src, '1235');
        src = '{% for i in (one..5) %}' +
            '{% if i == 4 %}{% break %}{% endif %}' +
            '{{ i }}' +
            '{% endfor %}';
        test(src, '123');
    });

    it('should support for with limit and offset', function() {
        src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}';
        test(src, '12');
        src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}';
        test(src, '67');
    });

    it('should support for reversed', function() {
        src = '{% for i in (1..5) limit:2 reversed %}{{ i }}{% endfor %}';
        test(src, '21');
    });

    it('should support cycle', function() {
        src = "{% cycle '1', '2', '3' %}";
        test(src + src + src + src, '1231');
    });

    it('should throw when cycle candidates empty', function() {
        testThrow('{%cycle%}', /empty candidates/);
    });

    it('should support cycle in for block', function() {
        src = '{% for i in (1..5) %}{% cycle one, "e"%}{% endfor %}';
        test(src, '1e1e1');
    });

    it('should support cycle group', function() {
        src = "{% cycle one: '1', '2', '3'%}" +
            "{% cycle 1: '1', '2', '3'%}" +
            "{% cycle 2: '1', '2', '3'%}";
        test(src, '121');
    });

    it('should support increment', function() {
        test('{% increment foo %}{%increment foo%}{{foo}}', '2');
        test('{% increment one %}{{one}}', '2');
    });

    it('should support decrement', function() {
        test('{% decrement foo %}{%decrement foo%}{{foo}}', '-2');
        test('{% decrement one %}{{one}}', '0');
    });

    it('should support tablerow', function() {
        src = '{% tablerow i in alpha cols:2 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">a</td><td class="col2">b</td></tr>' +
            '<tr class="row2"><td class="col1">c</td></tr>' +
            '</table>';
        test(src, dst);
    });

    it('should support empty tablerow', function() {
        src = '{% tablerow i in (1..0) cols:2 %}{{ i }}{% endtablerow %}';
        dst = '<table></table>';
        test(src, dst);
    });

    it('should support tablerow with range', function() {
        src = '{% tablerow i in (1..5) cols:2 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
            '<tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>' +
            '<tr class="row3"><td class="col1">5</td></tr>' +
            '</table>';
        test(src, dst);
    });

    it('tablerow should throw on illegal cols', function() {
        testThrow('{% tablerow i in (1..5) cols:0 %}{{ i }}{% endtablerow %}',
            /illegal cols: 0/);
        testThrow('{% tablerow i in (1..5) %}{{ i }}{% endtablerow %}',
            /illegal cols: undefined/);
    });

    it('should support tablerow with limit', function() {
        src = '{% tablerow i in (1..5) cols:2 limit:3 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
            '<tr class="row2"><td class="col1">3</td></tr>' +
            '</table>';
        test(src, dst);
    });

    it('should support tablerow with offset', function() {
        src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}';
        dst = '<table>' +
            '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>' +
            '</table>';
        test(src, dst);
    });
});
