const chai = require("chai");
const expect = chai.expect;

var liquid = require('..')(),
    ctx;

function test(src, dst) {
    ctx = {
        date: new Date(),
        foo: 'bar',
        arr: [-2, 'a'],
        obj: {
            foo: 'bar'
        },
        posts: [{
            category: 'foo'
        }, {
            category: 'bar'
        }]
    };
    expect(liquid.render(src, ctx)).to.equal(dst);
}

describe('filters', function() {
    it('should support abs', function() {
        test('{{ -3 | abs }}', '3');
        test('{{ arr[0] | abs }}', '2');
    });

    it('should support append', function() {
        test('{{ -3 | append: "abc" }}', '-3abc');
        test('{{ "a" | append: foo }}', 'abar');
    });

    it('should support capitalize', function() {
        test('{{ "i am good" | capitalize }}', 'I am good');
    });

    it('should support ceil', function() {
        test('{{ 1.2 | ceil }}', '2');
        test('{{ 2.0 | ceil }}', '2');
        test('{{ "3.5" | ceil }}', '4');
        test('{{ 183.357 | ceil }}', '184');
    });

    it('should support date', function() {
        str = ctx.date.toDateString();
        test('{{ date | date:"%a %b %d %Y"}}', str);
    });

    it('should support default', function() {
        test('{{false |default: "a"}}', 'a');
    });

    it('should support divided_by', function() {
        test('{{4 | divided_by: 2}}', '2');
        test('{{16 | divided_by: 4}}', '4');
        test('{{5 | divided_by: 3}}', '1');
    });

    it('should support downcase', function() {
        test('{{ "Parker Moore" | downcase }}', 'parker moore');
        test('{{ "apple" | downcase }}', 'apple');
    });
    it('should support escape', function() {
        test('{{ "Have you read \'James & the Giant Peach\'?" | escape }}',
            'Have you read &#39;James &amp; the Giant Peach&#39;?');
        test('{{ "Tetsuro Takara" | escape }}', 'Tetsuro Takara');
    });

    it('should support escape_once', function() {
        test('{{ "1 < 2 & 3" | escape_once }}', '1 &lt; 2 &amp; 3');
        test('{{ "1 &lt; 2 &amp; 3" | escape_once }}', '1 &lt; 2 &amp; 3');
    });

    it('should support split/first', function() {
        src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
            '{{ my_array | first }}';
        test(src, 'apples');
    });

    it('should support floor', function() {
        test('{{ 1.2 | floor }}', '1');
        test('{{ 2.0 | floor }}', '2');
        test('{{ 183.357 | floor }}', '183');
        test('{{ "3.5" | floor }}', '3');
    });

    it('should support join', function() {
        src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
            '{{ beatles | join: " and " }}';
        test(src, 'John and Paul and George and Ringo');
    });

    it('should support split/last', function() {
        src = '{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}' +
            '{{ my_array|last }}';
        test(src, 'tiger');
    });

    it('should support lstrip', function() {
        src = '{{ "          So much room for activities!          " | lstrip }}';
        test(src, 'So much room for activities!          ');
    });

    it('should support map', function() {
        test('{{posts | map: "category"}}', '["foo","bar"]');
    });

    it('should support minus', function() {
        test('{{ 4 | minus: 2 }}', '2');
        test('{{ 16 | minus: 4 }}', '12');
        test('{{ 183.357 | minus: 12 }}', '171.357');
    });

    it('should support modulo', function() {
        test('{{ 3 | modulo: 2 }}', '1');
        test('{{ 24 | modulo: 7 }}', '3');
        test('{{ 183.357 | modulo: 12 }}', '3.357');
    });

    it('should support string_with_newlines', function() {
        src = '{% capture string_with_newlines %}\n' +
            'Hello\n' +
            'there\n' +
            '{% endcapture %}' +
            '{{ string_with_newlines | newline_to_br }}';
        dst = '<br />' +
            'Hello<br />' +
            'there<br />';
        test(src, dst);
    });

    it('should support plus', function() {
        test('{{ 4 | plus: 2 }}', '6');
        test('{{ 16 | plus: 4 }}', '20');
        test('{{ 183.357 | plus: 12 }}', '195.357');
    });

    it('should support prepend', function() {
        test('{% assign url = "liquidmarkup.com" %}' +
            '{{ "/index.html" | prepend: url }}',
            'liquidmarkup.com/index.html');
    });

    it('should support remove', function() {
        test('{{ "I strained to see the train through the rain" | remove: "rain" }}',
            'I sted to see the t through the ');
    });

    it('should support remove_first', function() {
        test('{{ "I strained to see the train through the rain" | remove_first: "rain" }}',
            'I sted to see the train through the rain');
    });

    it('should support replace', function() {
        test('{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}',
            'Take your protein pills and put your helmet on');
    });

    it('should support replace_first', function() {
        test('{% assign my_string = "Take my protein pills and put my helmet on" %}\n' +
            '{{ my_string | replace_first: "my", "your" }}',
            '\nTake your protein pills and put my helmet on');
    });

    it('should support reverse', function() {
        test('{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}',
            '.moT rojaM ot lortnoc dnuorG');
    });

    it('should support round', function() {
        test('{{1.2|round}}', '1');
        test('{{2.7|round}}', '3');
        test('{{183.357|round: 2}}', '183.36');
    });

    it('should support rstrip', function() {
        test('{{ "          So much room for activities!          " | rstrip }}',
            '          So much room for activities!');
    });

    it('should support size', function() {
        test('{{ "Ground control to Major Tom." | size }}', '28');
        test('{% assign my_array = "apples, oranges, peaches, plums"' +
            ' | split: ", " %}{{ my_array | size }}',
            '4');
    });

    it('should support slice', function() {
        test('{{ "Liquid" | slice: 0 }}', 'L');
        test('{{ "Liquid" | slice: 2 }}', 'q');
        test('{{ "Liquid" | slice: 2, 5 }}', 'quid');
        test('{{ "Liquid" | slice: -3, 2 }}', 'ui');
    });

    it('should support sort', function() {
        test('{% assign my_array = "zebra, octopus, giraffe, Sally Snake"' +
            ' | split: ", " %}' +
            '{{ my_array | sort | join: ", " }}',
            'Sally Snake, giraffe, octopus, zebra');
    });

    it('should support split', function() {
        test('{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
            '{% for member in beatles %}' +
            '{{ member }} ' +
            '{% endfor %}',
            'John Paul George Ringo ');
    });

    it('should support strip', function() {
        test('{{ "          So much room for activities!          " | strip }}',
            'So much room for activities!');
    });

    it('should support strip_tml', function() {
        test('{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}',
            'Have you read Ulysses?');
        test('{{"<br/><br />< p ></p></ p >" | strip_html }}', '');
    });

    it('should support strip_newlines', function() {
        test('{% capture string_with_newlines %}\n' +
            'Hello\nthere\n{% endcapture %}' +
            '{{ string_with_newlines | strip_newlines }}',
            'Hellothere');
    });

    it('should support times', function() {
        test('{{ 3 | times: 2 }}', '6');
        test('{{ 24 | times: 7 }}', '168');
        test('{{ 183.357 | times: 12 }}', '2200.284');
    });

    it('should support truncate', function() {
        test('{{ "Ground control to Major Tom." | truncate: 20 }}',
            'Ground control to...');
        test('{{ "Ground control to Major Tom." | truncate: 80 }}',
            'Ground control to Major Tom.');
        test('{{ "Ground control to Major Tom." | truncate: 25,", and so on" }}',
            'Ground control, and so on');
        test('{{ "Ground control to Major Tom." | truncate: 20, "" }}',
            'Ground control to Ma');
    });

    it('should support truncatewords', function() {
        test('{{ "Ground control to Major Tom." | truncatewords: 3 }}',
            'Ground control to...');
        test('{{ "Ground control to Major Tom." | truncatewords: 8 }}',
            'Ground control to Major Tom.');
        test('{{ "Ground control to Major Tom." | truncatewords: 3, "--" }}',
            'Ground control to--');
        test('{{ "Ground control to Major Tom." | truncatewords: 3, "" }}',
            'Ground control to');
    });

    it('should support uniq', function() {
        test('{% assign my_array = "ants, bugs, bees, bugs, ants" | split: ", " %}' +
            '{{ my_array | uniq | join: ", " }}',
            'ants, bugs, bees');
    });

    it('should support upcase', function() {
        test('{{ "Parker Moore" | upcase }}', 'PARKER MOORE');
    });

    it('should support url_encode', function() {
        test('{{ "john@liquid.com" | url_encode }}', 'john%40liquid.com');
        test('{{ "Tetsuro Takara" | url_encode }}', 'Tetsuro%20Takara');
    });
});
