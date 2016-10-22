const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

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
        func: function() {},
        posts: [{
            category: 'foo'
        }, {
            category: 'bar'
        }]
    };
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(dst);
}

describe('filters', function() {
    it('should support abs 1', () => test('{{ -3 | abs }}', '3'));
    it('should support abs 2', () => test('{{ arr[0] | abs }}', '2'));

    it('should support append 1', () => test('{{ -3 | append: "abc" }}', '-3abc'));
    it('should support append 2', () => test('{{ "a" | append: foo }}', 'abar'));

    it('should support capitalize', () => test('{{ "i am good" | capitalize }}', 'I am good'));

    it('should support ceil 1', () => test('{{ 1.2 | ceil }}', '2'));
    it('should support ceil 2', () => test('{{ 2.0 | ceil }}', '2'));
    it('should support ceil 3', () => test('{{ "3.5" | ceil }}', '4'));
    it('should support ceil 4', () => test('{{ 183.357 | ceil }}', '184'));

    describe('date', function(){
        it('should support %a %b %d %Y', function() {
            var str = ctx.date.toDateString();
            return test('{{ date | date:"%a %b %d %Y"}}', str);
        });
        it('should support "now"', function() {
            var year = (new Date()).getFullYear();
            var src = '{{ "now" | date: "%Y"}}';
            return expect(liquid.parseAndRender(src)).to.eventually.match(/\d{4}/);
        });
    });

    it('should support default', () => test('{{false |default: "a"}}', 'a'));

    it('should support divided_by 1', () => test('{{4 | divided_by: 2}}', '2'));
    it('should support divided_by 2', () => test('{{16 | divided_by: 4}}', '4'));
    it('should support divided_by 3', () => test('{{5 | divided_by: 3}}', '1'));

    it('should support downcase 1', () => test('{{ "Parker Moore" | downcase }}', 'parker moore'));
    it('should support downcase 2', () => test('{{ "apple" | downcase }}', 'apple'));

    it('should support escape 1', function() {
        return test('{{ "Have you read \'James & the Giant Peach\'?" | escape }}',
            'Have you read &#39;James &amp; the Giant Peach&#39;?');
    });
    it('should support escape 2', function() {
        return test('{{ "Tetsuro Takara" | escape }}', 'Tetsuro Takara');
    });
    it('should support excape function', function() {
        return test('{{ func | escape }}', 'function () {}');
    });

    it('should support escape_once 1', () => test('{{ "1 < 2 & 3" | escape_once }}', '1 &lt; 2 &amp; 3'));
    it('should support escape_once 2', () => test('{{ "1 &lt; 2 &amp; 3" | escape_once }}', '1 &lt; 2 &amp; 3'));

    it('should support split/first', function() {
        var src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
            '{{ my_array | first }}';
        return test(src, 'apples');
    });

    it('should support floor 1', () => test('{{ 1.2 | floor }}', '1'));
    it('should support floor 2', () => test('{{ 2.0 | floor }}', '2'));
    it('should support floor 3', () => test('{{ 183.357 | floor }}', '183'));
    it('should support floor 4', () => test('{{ "3.5" | floor }}', '3'));

    it('should support join', function() {
        var src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
            '{{ beatles | join: " and " }}';
        return test(src, 'John and Paul and George and Ringo');
    });

    it('should support split/last', function() {
        var src = '{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}' +
            '{{ my_array|last }}';
        return test(src, 'tiger');
    });

    it('should support lstrip', function() {
        var src = '{{ "          So much room for activities!          " | lstrip }}';
        return test(src, 'So much room for activities!          ');
    });

    it('should support map', function() {
        return test('{{posts | map: "category"}}', '["foo","bar"]');
    });

    it('should support minus 1', () => test('{{ 4 | minus: 2 }}', '2'));
    it('should support minus 2', () => test('{{ 16 | minus: 4 }}', '12'));
    it('should support minus 3', () => test('{{ 183.357 | minus: 12 }}', '171.357'));

    it('should support modulo 1', () => test('{{ 3 | modulo: 2 }}', '1'));
    it('should support modulo 2', () => test('{{ 24 | modulo: 7 }}', '3'));
    it('should support modulo 3', () => test('{{ 183.357 | modulo: 12 }}', '3.357'));

    it('should support string_with_newlines', function() {
        var src = '{% capture string_with_newlines %}\n' +
            'Hello\n' +
            'there\n' +
            '{% endcapture %}' +
            '{{ string_with_newlines | newline_to_br }}';
        var dst = '<br />' +
            'Hello<br />' +
            'there<br />';
        return test(src, dst);
    });

    it('should support plus 1', () => test('{{ 4 | plus: 2 }}', '6'));
    it('should support plus 2', () => test('{{ 16 | plus: 4 }}', '20'));
    it('should support plus 3', () => test('{{ 183.357 | plus: 12 }}', '195.357'));

    it('should support prepend', function() {
        return test('{% assign url = "liquidmarkup.com" %}' +
            '{{ "/index.html" | prepend: url }}',
            'liquidmarkup.com/index.html');
    });

    it('should support remove', function() {
        return test('{{ "I strained to see the train through the rain" | remove: "rain" }}',
            'I sted to see the t through the ');
    });

    it('should support remove_first', function() {
        return test('{{ "I strained to see the train through the rain" | remove_first: "rain" }}',
            'I sted to see the train through the rain');
    });

    it('should support replace', function() {
        return test('{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}',
            'Take your protein pills and put your helmet on');
    });

    it('should support replace_first', function() {
        return test('{% assign my_string = "Take my protein pills and put my helmet on" %}\n' +
            '{{ my_string | replace_first: "my", "your" }}',
            '\nTake your protein pills and put my helmet on');
    });

    it('should support reverse', function() {
        return test('{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}',
            '.moT rojaM ot lortnoc dnuorG');
    });

    it('should support round 1', () => test('{{1.2|round}}', '1'));
    it('should support round 2', () => test('{{2.7|round}}', '3'));
    it('should support round 3', () => test('{{183.357|round: 2}}', '183.36'));

    it('should support rstrip', function() {
        return test('{{ "          So much room for activities!          " | rstrip }}',
            '          So much room for activities!');
    });

    it('should support size 1', () => test('{{ "Ground control to Major Tom." | size }}', '28'));
    it('should support size 2', function() {
        return test('{% assign my_array = "apples, oranges, peaches, plums"' +
            ' | split: ", " %}{{ my_array | size }}',
            '4');
    });

    it('should support slice 1', () => test('{{ "Liquid" | slice: 0 }}', 'L'));
    it('should support slice 2', () => test('{{ "Liquid" | slice: 2 }}', 'q'));
    it('should support slice 3', () => test('{{ "Liquid" | slice: 2, 5 }}', 'quid'));
    it('should support slice 4', () => test('{{ "Liquid" | slice: -3, 2 }}', 'ui'));

    it('should support sort', function() {
        return test('{% assign my_array = "zebra, octopus, giraffe, Sally Snake"' +
            ' | split: ", " %}' +
            '{{ my_array | sort | join: ", " }}',
            'Sally Snake, giraffe, octopus, zebra');
    });

    it('should support split', function() {
        return test('{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
            '{% for member in beatles %}' +
            '{{ member }} ' +
            '{% endfor %}',
            'John Paul George Ringo ');
    });

    it('should support strip', function() {
        return test('{{ "          So much room for activities!          " | strip }}',
            'So much room for activities!');
    });

    it('should support strip_tml 1', function() {
        return test('{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}',
            'Have you read Ulysses?');
    });
    it('should support strip_tml 2', function() {
        return test('{{"<br/><br />< p ></p></ p >" | strip_html }}', '');
    });

    it('should support strip_newlines', function() {
        return test('{% capture string_with_newlines %}\n' +
            'Hello\nthere\n{% endcapture %}' +
            '{{ string_with_newlines | strip_newlines }}',
            'Hellothere');
    });

    it('should support times 1', () => test('{{ 3 | times: 2 }}', '6'));
    it('should support times 2', () => test('{{ 24 | times: 7 }}', '168'));
    it('should support times 3', () => test('{{ 183.357 | times: 12 }}', '2200.284'));

    it('should support truncate 1', function() {
        return test('{{ "Ground control to Major Tom." | truncate: 20 }}',
            'Ground control to...');
    });
    it('should support truncate 2', function() {
        return test('{{ "Ground control to Major Tom." | truncate: 80 }}',
            'Ground control to Major Tom.');
    });
    it('should support truncate 3', function() {
        return test('{{ "Ground control to Major Tom." | truncate: 25,", and so on" }}',
            'Ground control, and so on');
    });
    it('should support truncate 4', function() {
        return test('{{ "Ground control to Major Tom." | truncate: 20, "" }}',
            'Ground control to Ma');
    });

    it('should support truncatewords 1', function() {
        return test('{{ "Ground control to Major Tom." | truncatewords: 3 }}',
            'Ground control to...');
    });
    it('should support truncatewords 2', function() {
        return test('{{ "Ground control to Major Tom." | truncatewords: 8 }}',
            'Ground control to Major Tom.');
    });
    it('should support truncatewords 3', function() {
        return test('{{ "Ground control to Major Tom." | truncatewords: 3, "--" }}',
            'Ground control to--');
    });
    it('should support truncatewords 4', function() {
        return test('{{ "Ground control to Major Tom." | truncatewords: 3, "" }}',
            'Ground control to');
    });

    it('should support uniq', function() {
        return test('{% assign my_array = "ants, bugs, bees, bugs, ants" | split: ", " %}' +
            '{{ my_array | uniq | join: ", " }}',
            'ants, bugs, bees');
    });

    it('should support upcase', () => test('{{ "Parker Moore" | upcase }}', 'PARKER MOORE'));

    it('should support url_encode 1', () => test('{{ "john@liquid.com" | url_encode }}', 'john%40liquid.com'));
    it('should support url_encode 2', () => test('{{ "Tetsuro Takara" | url_encode }}', 'Tetsuro%20Takara'));
});
