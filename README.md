# shopify-liquid

[![NPM version](https://img.shields.io/npm/v/shopify-liquid.svg?style=flat)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coverage Status](https://img.shields.io/coveralls/harttle/shopify-liquid/master.svg)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![Dependency manager](https://img.shields.io/david/harttle/shopify-liquid.svg?style=flat)](https://david-dm.org/harttle/shopify-liquid)

A feature-rich [Liquid][shopify-liquid] implementation for Node.js, with compliance with [Jekyll][jekyll] and [Github Pages][gh].
See:

* [supported filter list](https://github.com/harttle/shopify-liquid/wiki/Builtin-Filters), and
* [supported tag list](https://github.com/harttle/shopify-liquid/wiki/Builtin-Tags)

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
// Note: the below opts also work:
// engine.render(tpl, ctx, opts)
// engine.renderFile(path, ctx, opts)
```

## Use with Express.js

```javascript
// register liquid engine
app.engine('liquid', engine.express({
    strict_variables: true,         // Default: fasle
    strict_filters: true            // Default: false
})); 
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

## Contribution Guide

1. Make a fork.
2. Write a test to demonstrate your feature is not supported yet.
3. Optionaly, change source files to make all test pass.
4. Create a pull request.

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
[shopify-liquid]: https://shopify.github.io/liquid/
[jekyll]: http://jekyllrb.com/
[gh]: https://pages.github.com/
[releases]: https://github.com/harttle/shopify-liquid/releases
