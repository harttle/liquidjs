# shopify-liquid

[![NPM version](https://img.shields.io/npm/v/shopify-liquid.svg?style=flat)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coverage Status](https://coveralls.io/repos/github/harttle/shopify-liquid/badge.svg?branch=master&ver=1.1.1)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![Dependency manager](https://david-dm.org/harttle/shopify-liquid.png)](https://david-dm.org/harttle/shopify-liquid)

[Liquid][shopify-liquid] implementation for Node.js.
All tags and filters listed in [Shopify Documentation][shopify-liquid]
shall be implemented.

> [Shopify liquid][shopify-liquid] is used by [Jekyll][jekyll] and [Github Pages][gh].

Installation:

```bash
npm install --save shopify-liquid
```

## Render from String

Parse and Render:

```javascript
var Liquid = require('shopify-liquid');
var engine = Liquid();

engine.parseAndRender('{{name | capitalize}}', {name: 'alice'});  // Alice
```

Caching templates:

```javascript
var tpl = engine.parse('{{name | capitalize}}');
engine.render(tpl, {name: 'alice'}); // Alice
```

## Render from File

```javascript
var engine = Liquid({
    root: path.resolve(__dirname, 'views/'),
    extname: '.liquid',
    cache: false
});
// equivalent to: engine.renderFile("hello", {name: 'alice'});
var html = engine.renderFile("hello.html", {name: 'alice'});
```

`cache` default to `false`, `extname` default to `.liquid`, `root` default to `""`.

## Includes and Layouts

### Includes

```
// file: color.liquid
color: '{{ color }}' shape: '{{ shape }}'

// file: theme.liquid
{% assign shape = 'circle' %}
{% include 'color' %}
{% include 'color' with 'red' %}
{% include 'color', color: 'yellow', shape: 'square' %}
```

The output will be:

```
color: '' shape: 'circle'
color: 'red' shape: 'circle'
color: 'yellow' shape: 'square'
```

### Layouts

```
// file: default-layout.html
Header
{% block content %}My default content{% endblock %}
Footer

// file: page.html
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

The output of `page.html`:

```
Header
My page content
Footer
```

* It's possible to define multiple blocks.
* block name is optional when there's only one block.

## Extension

Register Filters:

```javascript
// Usage: {{ name | uppper }}
engine.registerFilter('upper', function(v){
  return v.toUpperCase();
});
```

> See existing filter implementations: <https://github.com/harttle/shopify-liquid/blob/master/filters.js>

Register Tags:

```javascript
// Usage: {% upper name%}
engine.registerTag('upper', {
    parse: function(tagToken, remainTokens) {
        this.str = tagToken.args; // name
    },
    render: function(scope, hash) {
        var str = Liquid.evalValue(this.str, scope); // 'alice'
        return str.toUpperCase(); // 'Alice'
    }
});
```

> See existing tag implementations: <https://github.com/harttle/shopify-liquid/blob/master/tags/>

## Operators

Documentation: <https://shopify.github.io/liquid/basics/operators/>

`==`, `!=`, `>`, `<`, `>=`, `<=`, `or`, `and`, `contains`.

## Tags

Documentation: <https://shopify.github.io/liquid/basics/introduction/#tags>

Tag | Document | Source | Test
--- | --- | --- | ---
`case/when` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/case.js) | [Test][tt]
`if` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/if.js) | [Test][tt]
`unless` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/unless.js) | [Test][tt]
`elsif/else` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/if.js) | [Test][tt]
`for` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) | [Test][tt]
`break` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) | [Test][tt]
`continue` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) | [Test][tt]
`for: limit,offset,range,reversed` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) | [Test][tt]
`cycle` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/cycle.js) | [Test][tt]
`cycle: group` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/cycle.js) | [Test][tt]
`tablerow` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/tablerow.js) | [Test][tt]
`tablerow: cols,limit,offset,range` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/tablerow.js) | [Test][tt]
`assign` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/assign.js) | [Test][tt]
`capture` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/capture.js) | [Test][tt]
`increment` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/increment.js) | [Test][tt]
`decrement` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/decrement.js) | [Test][tt]
`raw` | [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#raw) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/raw.js) | [Test][tt]
`comment` | [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#comment) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/comment.js) | [Test][tt]
`include` | [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#include) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/include.js) | [Test][tt]
`layout, block` | [Document](http://docs.mixture.io/templates/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/layout.js) | [Test][tt]


## Filters

Documentation: <https://shopify.github.io/liquid/basics/introduction/#filters>

Filter | Document | Source | Test
--- | --- | --- | ---
`abs` | [Document](https://shopify.github.io/liquid/filters/abs/) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`append` | [Document](https://shopify.github.io/liquid/filters/append) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`capitalize` | [Document](https://shopify.github.io/liquid/filters/capitalize) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`ceil` | [Document](https://shopify.github.io/liquid/filters/ceil) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`date` | [Document](https://shopify.github.io/liquid/filters/date) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`default` | [Document](https://shopify.github.io/liquid/filters/default) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`divided_by` | [Document](https://shopify.github.io/liquid/filters/divided_by) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`downcase` | [Document](https://shopify.github.io/liquid/filters/downcase) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`escape` | [Document](https://shopify.github.io/liquid/filters/escape) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`escape_once` | [Document](https://shopify.github.io/liquid/filters/escape_once) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`first` | [Document](https://shopify.github.io/liquid/filters/first) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`floor` | [Document](https://shopify.github.io/liquid/filters/floor) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`join` | [Document](https://shopify.github.io/liquid/filters/join) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`last` | [Document](https://shopify.github.io/liquid/filters/last) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`lstrip` | [Document](https://shopify.github.io/liquid/filters/lstrip) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`map` | [Document](https://shopify.github.io/liquid/filters/map) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`minus` | [Document](https://shopify.github.io/liquid/filters/minus) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`modulo` | [Document](https://shopify.github.io/liquid/filters/modulo) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`newline_to_br` | [Document](https://shopify.github.io/liquid/filters/newline_to_br) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`plus` | [Document](https://shopify.github.io/liquid/filters/plus) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`prepend` | [Document](https://shopify.github.io/liquid/filters/prepend) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`remove` | [Document](https://shopify.github.io/liquid/filters/remove) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`remove_first` | [Document](https://shopify.github.io/liquid/filters/remove_first) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`replace` | [Document](https://shopify.github.io/liquid/filters/replace) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`replace_first` | [Document](https://shopify.github.io/liquid/filters/replace_first) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`reverse` | [Document](https://shopify.github.io/liquid/filters/reverse) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`round` | [Document](https://shopify.github.io/liquid/filters/round) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`rstrip` | [Document](https://shopify.github.io/liquid/filters/rstrip) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`size` | [Document](https://shopify.github.io/liquid/filters/size) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`slice` | [Document](https://shopify.github.io/liquid/filters/slice) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`sort` | [Document](https://shopify.github.io/liquid/filters/sort) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`split` | [Document](https://shopify.github.io/liquid/filters/split) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`strip` | [Document](https://shopify.github.io/liquid/filters/strip) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`strip_html` | [Document](https://shopify.github.io/liquid/filters/strip_html) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`strip_newlines` | [Document](https://shopify.github.io/liquid/filters/strip_newlines) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`times` | [Document](https://shopify.github.io/liquid/filters/times) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`truncate` | [Document](https://shopify.github.io/liquid/filters/truncate) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`truncatewords` | [Document](https://shopify.github.io/liquid/filters/truncatewords) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`uniq` | [Document](https://shopify.github.io/liquid/filters/uniq) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`upcase` | [Document](https://shopify.github.io/liquid/filters/upcase) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]
`url_encode` | [Document](https://shopify.github.io/liquid/filters/url_encode) | [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) | [Test][ft]

## Async Support

harttle/shopify-liquid do NOT support async rendering, this is by design.

The primary principle of harttle/shopify-liquid is EASY TO EXTEND.
Async rendering introduces extra complexity in both implementation and extension.

For template-driven projects, checkout these Liquid-like engines:

* liquid-node: <https://github.com/sirlantis/liquid-node> 
* nunjucks: <http://mozilla.github.io/nunjucks/>

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
[shopify-liquid]: https://shopify.github.io/liquid/
[jekyll]: http://jekyllrb.com/
[gh]: https://pages.github.com/
[tt]: https://github.com/harttle/shopify-liquid/blob/master/test/tags.js
[ft]: https://github.com/harttle/shopify-liquid/blob/master/test/filters.js
