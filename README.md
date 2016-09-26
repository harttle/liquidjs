# shopify-liquid

[![NPM version](https://img.shields.io/npm/v/shopify-liquid.svg?style=flat)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coverage Status](https://coveralls.io/repos/github/harttle/shopify-liquid/badge.svg?branch=master&ver=1.1.1)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![Dependency manager](https://img.shields.io/david/dev/harttle/shopify-liquid.svg?style=flat)](https://david-dm.org/harttle/shopify-liquid)

A feature-rich [Liquid][shopify-liquid] implementation for Node.js, with compliance with [Jekyll][jekyll] and [Github Pages][gh].

Installation:

```bash
npm install --save shopify-liquid
```

## Render from String

Parse and Render:

```javascript
var Liquid = require('shopify-liquid');
var engine = Liquid();

engine.parseAndRender('{{name | capitalize}}', {name: 'alice'})
    .then(function(html){
        // html === 'Alice'
    });
```

Caching templates:

```javascript
var tpl = engine.parse('{{name | capitalize}}');
engine.render(tpl, {name: 'alice'})
    .then(function(html){   
        // html === 'Alice'
    });
```

## Render from File

```javascript
var engine = Liquid({
    root: path.resolve(__dirname, 'views/'),  // for layouts and partials
    extname: '.liquid',
    cache: false
});
engine.renderFile("hello.liquid", {name: 'alice'})
    .then(function(html){
       // html === 'Alice'
    });
// equivalent to: 
engine.renderFile("hello", {name: 'alice'})
    .then(function(html){
       // html === 'Alice'
    });
```

`cache` default to `false`, `extname` default to `.liquid`, `root` default to `""`.

## Strict Rendering

Undefined filters and variables will be rendered as empty string by default.
Enable strict rendering to throw errors upon undefined variables/filters:

```javascript
var opts = {
    strict_variables: true, 
    strict_filters: true
};
engine.parseAndRender("{{ foo }}", {}, opts).catch(function(err){
    // err.message === undefined variable: foo
});
engine.parseAndRender("{{ 'foo' | filter1 }}", {}, opts).catch(function(err){
    // err.message === undefined filter: filter1
});
// Note:
// `engine.render(tpl, ctx, opts)` and `engine.renderFile(path, ctx, opts)` also works.
```

## Use with Express.js

```javascript
app.engine('liquid', engine.express()); // register liquid engine
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set to default
```

There's an Express demo [here](demo/express/).

## Use in Browser

[Download][releases] the dist files and import into your HTML.
And `window.Liquid` is what you want.

```html
<html lang="en">
<head>
  <script src="shopify-liquid.min.js"></script>
</head>
<body>
  <script>
    var engine = window.Liquid();
    var src = '{{ name | capitalize}}';
    var ctx = {
      name: 'welcome to Shopify Liquid'
    };
    engine.parseAndRender(src, ctx)
      .then(function(html) {
        // html === Welcome to Shopify Liquid 
      });
  </script>
</body>
</html>
```

There's also a [demo](demo/browser/).

## Includes

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

## Layouts

```
// file: default-layout.liquid
Header
{% block content %}My default content{% endblock %}
Footer

// file: page.liquid
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

The output of `page.liquid`:

```
Header
My page content
Footer
```

* It's possible to define multiple blocks.
* block name is optional when there's only one block.

## Register Filters

```javascript
// Usage: {{ name | uppper }}
engine.registerFilter('upper', function(v){
  return v.toUpperCase();
});
```

> See existing filter implementations: <https://github.com/harttle/shopify-liquid/blob/master/filters.js>

## Register Tags

```javascript
// Usage: {% upper name%}
engine.registerTag('upper', {
    parse: function(tagToken, remainTokens) {
        this.str = tagToken.args; // name
    },
    render: function(scope, hash) {
        var str = Liquid.evalValue(this.str, scope); // 'alice'
        return Promise.resolve(str.toUpperCase()); // 'Alice'
    }
});
```

> See existing tag implementations: <https://github.com/harttle/shopify-liquid/blob/master/tags/>

## All Tags

Documentation: <https://shopify.github.io/liquid/basics/introduction/#tags>

Tag | Document | Source | Test
--- | --- | --- | ---
`case/when` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](tags/case.js) | [Test](test/tags/case.js)
`if` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](tags/if.js) | [Test](test/tags/if.js)
`unless` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](tags/unless.js) | [Test](test/tags/unless.js)
`elsif/else` | [Document](https://shopify.github.io/liquid/tags/control-flow/) | [Source](tags/if.js) | [Test](test/tags/if.js)
`for` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/for.js) | [Test](test/tags/for.js)
`break` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/for.js) | [Test](test/tags/for.js)
`continue` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/for.js) | [Test](test/tags/for.js)
`for: limit,offset,range,reversed` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/for.js) | [Test](test/tags/for.js)
`cycle` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/cycle.js) | [Test](test/tags/cycle.js)
`cycle: group` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/cycle.js) | [Test](test/tags/cycle.js)
`tablerow` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/tablerow.js) | [Test](test/tags/tablerow.js)
`tablerow: cols,limit,offset,range` | [Document](https://shopify.github.io/liquid/tags/iteration/) | [Source](tags/tablerow.js) | [Test](test/tags/tablerow.js)
`assign` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](tags/assign.js) | [Test](test/tags/assign.js)
`capture` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](tags/capture.js) | [Test](test/tags/capture.js)
`increment` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](tags/increment.js) | [Test](test/tags/increment.js)
`decrement` | [Document](https://shopify.github.io/liquid/tags/variable/) | [Source](tags/decrement.js) | [Test](test/tags/decrement.js)
`raw` | [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#raw) | [Source](tags/raw.js) | [Test](test/tags/raw.js)
`comment` | [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#comment) | [Source](tags/comment.js) | [Test](test/tags/comment.js)
`include` | [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#include) | [Source](tags/include.js) | [Test](test/tags/include.js)
`layout, block` | [Document](http://docs.mixture.io/templates/) | [Source](tags/layout.js) | [Test](test/tags/layout.js)


## All Filters

Documentation: <https://shopify.github.io/liquid/basics/introduction/#filters>

Filter | Document | Source | Test
--- | --- | --- | ---
`abs` | [Document](https://shopify.github.io/liquid/filters/abs/) | [Source](filters.js) | [Test](test/filters.js)
`append` | [Document](https://shopify.github.io/liquid/filters/append) | [Source](filters.js) | [Test](test/filters.js)
`capitalize` | [Document](https://shopify.github.io/liquid/filters/capitalize) | [Source](filters.js) | [Test](test/filters.js)
`ceil` | [Document](https://shopify.github.io/liquid/filters/ceil) | [Source](filters.js) | [Test](test/filters.js)
`date` | [Document](https://shopify.github.io/liquid/filters/date) | [Source](filters.js) | [Test](test/filters.js)
`default` | [Document](https://shopify.github.io/liquid/filters/default) | [Source](filters.js) | [Test](test/filters.js)
`divided_by` | [Document](https://shopify.github.io/liquid/filters/divided_by) | [Source](filters.js) | [Test](test/filters.js)
`downcase` | [Document](https://shopify.github.io/liquid/filters/downcase) | [Source](filters.js) | [Test](test/filters.js)
`escape` | [Document](https://shopify.github.io/liquid/filters/escape) | [Source](filters.js) | [Test](test/filters.js)
`escape_once` | [Document](https://shopify.github.io/liquid/filters/escape_once) | [Source](filters.js) | [Test](test/filters.js)
`first` | [Document](https://shopify.github.io/liquid/filters/first) | [Source](filters.js) | [Test](test/filters.js)
`floor` | [Document](https://shopify.github.io/liquid/filters/floor) | [Source](filters.js) | [Test](test/filters.js)
`join` | [Document](https://shopify.github.io/liquid/filters/join) | [Source](filters.js) | [Test](test/filters.js)
`last` | [Document](https://shopify.github.io/liquid/filters/last) | [Source](filters.js) | [Test](test/filters.js)
`lstrip` | [Document](https://shopify.github.io/liquid/filters/lstrip) | [Source](filters.js) | [Test](test/filters.js)
`map` | [Document](https://shopify.github.io/liquid/filters/map) | [Source](filters.js) | [Test](test/filters.js)
`minus` | [Document](https://shopify.github.io/liquid/filters/minus) | [Source](filters.js) | [Test](test/filters.js)
`modulo` | [Document](https://shopify.github.io/liquid/filters/modulo) | [Source](filters.js) | [Test](test/filters.js)
`newline_to_br` | [Document](https://shopify.github.io/liquid/filters/newline_to_br) | [Source](filters.js) | [Test](test/filters.js)
`plus` | [Document](https://shopify.github.io/liquid/filters/plus) | [Source](filters.js) | [Test](test/filters.js)
`prepend` | [Document](https://shopify.github.io/liquid/filters/prepend) | [Source](filters.js) | [Test](test/filters.js)
`remove` | [Document](https://shopify.github.io/liquid/filters/remove) | [Source](filters.js) | [Test](test/filters.js)
`remove_first` | [Document](https://shopify.github.io/liquid/filters/remove_first) | [Source](filters.js) | [Test](test/filters.js)
`replace` | [Document](https://shopify.github.io/liquid/filters/replace) | [Source](filters.js) | [Test](test/filters.js)
`replace_first` | [Document](https://shopify.github.io/liquid/filters/replace_first) | [Source](filters.js) | [Test](test/filters.js)
`reverse` | [Document](https://shopify.github.io/liquid/filters/reverse) | [Source](filters.js) | [Test](test/filters.js)
`round` | [Document](https://shopify.github.io/liquid/filters/round) | [Source](filters.js) | [Test](test/filters.js)
`rstrip` | [Document](https://shopify.github.io/liquid/filters/rstrip) | [Source](filters.js) | [Test](test/filters.js)
`size` | [Document](https://shopify.github.io/liquid/filters/size) | [Source](filters.js) | [Test](test/filters.js)
`slice` | [Document](https://shopify.github.io/liquid/filters/slice) | [Source](filters.js) | [Test](test/filters.js)
`sort` | [Document](https://shopify.github.io/liquid/filters/sort) | [Source](filters.js) | [Test](test/filters.js)
`split` | [Document](https://shopify.github.io/liquid/filters/split) | [Source](filters.js) | [Test](test/filters.js)
`strip` | [Document](https://shopify.github.io/liquid/filters/strip) | [Source](filters.js) | [Test](test/filters.js)
`strip_html` | [Document](https://shopify.github.io/liquid/filters/strip_html) | [Source](filters.js) | [Test](test/filters.js)
`strip_newlines` | [Document](https://shopify.github.io/liquid/filters/strip_newlines) | [Source](filters.js) | [Test](test/filters.js)
`times` | [Document](https://shopify.github.io/liquid/filters/times) | [Source](filters.js) | [Test](test/filters.js)
`truncate` | [Document](https://shopify.github.io/liquid/filters/truncate) | [Source](filters.js) | [Test](test/filters.js)
`truncatewords` | [Document](https://shopify.github.io/liquid/filters/truncatewords) | [Source](filters.js) | [Test](test/filters.js)
`uniq` | [Document](https://shopify.github.io/liquid/filters/uniq) | [Source](filters.js) | [Test](test/filters.js)
`upcase` | [Document](https://shopify.github.io/liquid/filters/upcase) | [Source](filters.js) | [Test](test/filters.js)
`url_encode` | [Document](https://shopify.github.io/liquid/filters/url_encode) | [Source](filters.js) | [Test](test/filters.js)

## Operators

Documentation: <https://shopify.github.io/liquid/basics/operators/>

`==`, `!=`, `>`, `<`, `>=`, `<=`, `or`, `and`, `contains`.

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
[shopify-liquid]: https://shopify.github.io/liquid/
[jekyll]: http://jekyllrb.com/
[gh]: https://pages.github.com/
[releases]: https://github.com/harttle/shopify-liquid/releases
