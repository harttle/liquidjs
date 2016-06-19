# shopify-liquid

[![NPM version](https://img.shields.io/npm/v/shopify-liquid.svg?style=flat)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coverage Status](https://coveralls.io/repos/github/harttle/shopify-liquid/badge.svg?branch=master&ver=1.1.1)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![Dependency manager](https://david-dm.org/harttle/shopify-liquid.png)](https://david-dm.org/harttle/shopify-liquid)

[Liquid][shopify-liquid] implementation for Node.js.
All tags and filters listed in [Shopify Documentation][shopify-liquid]
shall be implemented.

> [Shopify liquid][shopify-liquid] is used by [Jekyll][jekyll] and [Github Pages][gh].

## Usage

Install:

```bash
npm install --save shopify-liquid
```

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

- [x] case/when [Document](https://shopify.github.io/liquid/tags/control-flow/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/case.js) [Test][tt]
- [x] if [Document](https://shopify.github.io/liquid/tags/control-flow/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/if.js) [Test][tt]
- [x] unless [Document](https://shopify.github.io/liquid/tags/control-flow/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/unless.js) [Test][tt]
- [x] elsif [Document/else](https://shopify.github.io/liquid/tags/control-flow/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/if.js) [Test][tt]
- [x] for [Document](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) [Test][tt]
- [x] break [Document](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) [Test][tt]
- [x] continue [Document](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) [Test][tt]
- [x] for [Document: limit,offset,range,reversed)](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/for.js) [Test][tt]
- [x] cycle [Document](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/cycle.js) [Test][tt]
- [x] cycle [Document: group)](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/cycle.js) [Test][tt]
- [x] tablerow [Document](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/tablerow.js) [Test][tt]
- [x] tablerow [Document: cols,limit,offset,range](https://shopify.github.io/liquid/tags/iteration/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/tablerow.js) [Test][tt]
- [x] assign [Document](https://shopify.github.io/liquid/tags/variable/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/assign.js) [Test][tt]
- [x] capture [Document](https://shopify.github.io/liquid/tags/variable/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/capture.js) [Test][tt]
- [x] increment [Document](https://shopify.github.io/liquid/tags/variable/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/increment.js) [Test][tt]
- [x] decrement [Document](https://shopify.github.io/liquid/tags/variable/) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/decrement.js) [Test][tt]
- [x] raw [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#raw) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/raw.js) [Test][tt]
- [x] comment [Document](https://help.shopify.com/themes/liquid/tags/theme-tags#comment) [Source](https://github.com/harttle/shopify-liquid/blob/master/tags/comment.js) [Test][tt]


## Filters

Documentation: <https://shopify.github.io/liquid/basics/introduction/#filters>

- [x] abs [Document](https://shopify.github.io/liquid/filters/abs/) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] append [Document](https://shopify.github.io/liquid/filters/append) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] capitalize [Document](https://shopify.github.io/liquid/filters/capitalize) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] ceil [Document](https://shopify.github.io/liquid/filters/ceil) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] date [Document](https://shopify.github.io/liquid/filters/date) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] default [Document](https://shopify.github.io/liquid/filters/default) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] divided_by [Document](https://shopify.github.io/liquid/filters/divided_by) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] downcase [Document](https://shopify.github.io/liquid/filters/downcase) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] escape [Document](https://shopify.github.io/liquid/filters/escape) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] escape_once [Document](https://shopify.github.io/liquid/filters/escape_once) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] first [Document](https://shopify.github.io/liquid/filters/first) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] floor [Document](https://shopify.github.io/liquid/filters/floor) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] join [Document](https://shopify.github.io/liquid/filters/join) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] last [Document](https://shopify.github.io/liquid/filters/last) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] lstrip [Document](https://shopify.github.io/liquid/filters/lstrip) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] map [Document](https://shopify.github.io/liquid/filters/map) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] minus [Document](https://shopify.github.io/liquid/filters/minus) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] modulo [Document](https://shopify.github.io/liquid/filters/modulo) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] newline_to_br [Document](https://shopify.github.io/liquid/filters/newline_to_br) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] plus [Document](https://shopify.github.io/liquid/filters/plus) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] prepend [Document](https://shopify.github.io/liquid/filters/prepend) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] remove [Document](https://shopify.github.io/liquid/filters/remove) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] remove_first [Document](https://shopify.github.io/liquid/filters/remove_first) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] replace [Document](https://shopify.github.io/liquid/filters/replace) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] replace_first [Document](https://shopify.github.io/liquid/filters/replace_first) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] reverse [Document](https://shopify.github.io/liquid/filters/reverse) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] round [Document](https://shopify.github.io/liquid/filters/round) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] rstrip [Document](https://shopify.github.io/liquid/filters/rstrip) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] size [Document](https://shopify.github.io/liquid/filters/size) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] slice [Document](https://shopify.github.io/liquid/filters/slice) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] sort [Document](https://shopify.github.io/liquid/filters/sort) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] split [Document](https://shopify.github.io/liquid/filters/split) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] strip [Document](https://shopify.github.io/liquid/filters/strip) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] strip_html [Document](https://shopify.github.io/liquid/filters/strip_html) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] strip_newlines [Document](https://shopify.github.io/liquid/filters/strip_newlines) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] times [Document](https://shopify.github.io/liquid/filters/times) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] truncate [Document](https://shopify.github.io/liquid/filters/truncate) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] truncatewords [Document](https://shopify.github.io/liquid/filters/truncatewords) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] uniq [Document](https://shopify.github.io/liquid/filters/uniq) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] upcase [Document](https://shopify.github.io/liquid/filters/upcase) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [x] url_encode [Document](https://shopify.github.io/liquid/filters/url_encode) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]

## Differences from Shopify Liquid

* `url_encode` is based on `encodeURIComponent`, ` ` will be converted to `%20`.

## Async Support

harttle/shopify-liquid do NOT support async rendering, this is by design.

The primary principle of harttle/shopify-liquid is EASY TO EXTEND.
Async rendering introduces extra complexity in both implementation and extension.

For template-driven projects, checkout these Liquid-like engines:

* [liquid-node][liquid-node]: <https://github.com/sirlantis/liquid-node> 
* [nunjucks][nunjucks]: <http://mozilla.github.io/nunjucks/>

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
[shopify-liquid]: https://shopify.github.io/liquid/
[jekyll]: http://jekyllrb.com/
[gh]: https://pages.github.com/
[tt]: https://github.com/harttle/shopify-liquid/blob/master/test/tags.js
[ft]: https://github.com/harttle/shopify-liquid/blob/master/test/filters.js
