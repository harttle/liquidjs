# shopify-liquid

[![npm](https://img.shields.io/npm/v/shopify-liquid.svg)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coveralls](https://img.shields.io/coveralls/harttle/shopify-liquid.svg)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![GitHub issues](https://img.shields.io/github/issues-closed/harttle/shopify-liquid.svg)](https://github.com/harttle/shopify-liquid/issues)

A Liquid template engine with a wide range of tags and filters,
for both Node.js and browsers.
Here's a live demo: <http://harttle.com/shopify-liquid/>

> The Liquid template engine is implemented in Ruby originally, 
> which is used by [Jekyll][jekyll] and [Github Pages][gh].

Features:

* A wide range of [filters](https://github.com/harttle/shopify-liquid/wiki/Builtin-Filters) and [tags](https://github.com/harttle/shopify-liquid/wiki/Builtin-Tags)
* Easy tag/filter registration, allows async tags
* [any-promise][any-promise]

API Reference:

* Builtin Tags: <https://github.com/harttle/shopify-liquid/wiki/Builtin-Tags>
* Builtin Filters: <https://github.com/harttle/shopify-liquid/wiki/Builtin-Filters>
* Operators: <https://github.com/harttle/shopify-liquid/wiki/Operators>
* Whitespace Control: <https://github.com/harttle/shopify-liquid/wiki/Whitespace-Control>

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
    root: path.resolve(__dirname, 'views/'),  // dirs to lookup layouts/includes
    extname: '.liquid'          // the default extname used for layouts/includes
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

## Options

The full list of options for `Liquid()` is listed as following:

* `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`.
If an array, the files are looked up in the order they occur in the array.
Defaults to `["."]`

* `extname` is used to lookup the template file when filepath doesn't include an extension name. Defaults to `".liquid"`

* `cache` indicates whether or not to cache resolved templates. Defaults to `false`.

* `strict_filters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`.

* `strict_variables` is used to enable strict variable derivation. 
If set to `false`, undefined variables will be rendered as empty string.
Otherwise, undefined variables will cause an exception. Defaults to `false`.

* `trim_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`.

* `trim_left` is similiar to `trim_right`, whereas the `\n` is exclusive. Defaults to `false`. See [Whitespace Control][whitespace control] for details.

* `greedy` is used to specify whether `trim_left`/`trim_right` is greedy. When set to `true`, all successive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `false`.

## Use with Express.js

```javascript
// register liquid engine
app.engine('liquid', engine.express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set to default
```

> There's an Express demo [here](demo/express/).

When using with Express.js, partials(includes and layouts) will be looked up in
both Liquid `root` and Express `views` directories.

## Use in Browser

[Download][releases] the dist files and import into your HTML.
And `window.Liquid` is what you want. There's also a [demo](demo/browser/).

```html
<html lang="en">
<head>
  <script src="dist/liquid.min.js"></script>
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

Note: In [IE and Android UC][caniuse-promises] browser, you need a Promise implementation
registered to [any-promise][any-promise].

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

## Contribution Guide

1. Write a [test][test] to define the feature you want.
2. File an issue, or optionally:
3. Get your test pass and make a pull request.

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
[shopify-liquid]: https://shopify.github.io/liquid/
[jekyll]: http://jekyllrb.com/
[gh]: https://pages.github.com/
[releases]: https://github.com/harttle/shopify-liquid/releases
[any-promise]: https://github.com/kevinbeaty/any-promise
[test]: https://github.com/harttle/shopify-liquid/tree/master/test
[caniuse-promises]: http://caniuse.com/#feat=promises
[whitespace control]: https://github.com/harttle/shopify-liquid/wiki/Whitespace-Control
