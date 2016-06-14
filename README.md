# shopify-liquid

[![NPM version](https://img.shields.io/npm/v/shopify-liquid.svg?style=flat)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coverage Status](https://coveralls.io/repos/github/harttle/shopify-liquid/badge.svg?branch=master)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![Dependency manager](https://david-dm.org/harttle/shopify-liquid.png)](https://david-dm.org/harttle/shopify-liquid)

[Liquid][shopify-liquid] implementation for Node.js.
All tags and filters listed in [Shopify Documentation][shopify-liquid]
shall be implemented.

> Shopify liquid is used by [Jekyll][jekyll] and [Github Pages][gh].

## Tags

Documentation: <https://shopify.github.io/liquid/basics/introduction/#tags>

- [x] [assign](https://shopify.github.io/liquid/tags/control-flow/)
- [ ] [case/when](https://shopify.github.io/liquid/tags/control-flow/)
- [ ] [if](https://shopify.github.io/liquid/tags/control-flow/)
- [ ] [unless](https://shopify.github.io/liquid/tags/control-flow/)
- [ ] [elsif/else](https://shopify.github.io/liquid/tags/control-flow/)
- [ ] [for](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [break](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [continue](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [for: limit,offset,range,reversed)](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [cycle](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [cycle: group)](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [tablerow](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [tablerow: cols,limit,offset,range](https://shopify.github.io/liquid/tags/iteration/)
- [ ] [assign](https://shopify.github.io/liquid/tags/variable/)
- [ ] [capture](https://shopify.github.io/liquid/tags/variable/)
- [ ] [increment](https://shopify.github.io/liquid/tags/variable/)
- [ ] [decrement](https://shopify.github.io/liquid/tags/variable/)


## Filters

Documentation: <https://shopify.github.io/liquid/basics/introduction/#filters>

- [x] [abs](https://shopify.github.io/liquid/filters/abs/)
- [ ] [append](https://shopify.github.io/liquid/filters/append)
- [ ] [capitalize](https://shopify.github.io/liquid/filters/capitalize)
- [ ] [ceil](https://shopify.github.io/liquid/filters/ceil)
- [ ] [date](https://shopify.github.io/liquid/filters/date)
- [ ] [default](https://shopify.github.io/liquid/filters/default)
- [ ] [divided_by](https://shopify.github.io/liquid/filters/divided_by)
- [ ] [downcase](https://shopify.github.io/liquid/filters/downcase)
- [ ] [escape](https://shopify.github.io/liquid/filters/escape)
- [ ] [escape_once](https://shopify.github.io/liquid/filters/escape_once)
- [ ] [first](https://shopify.github.io/liquid/filters/first)
- [ ] [floor](https://shopify.github.io/liquid/filters/floor)
- [ ] [join](https://shopify.github.io/liquid/filters/join)
- [ ] [last](https://shopify.github.io/liquid/filters/last)
- [ ] [lstrip](https://shopify.github.io/liquid/filters/lstrip)
- [ ] [map](https://shopify.github.io/liquid/filters/map)
- [ ] [minus](https://shopify.github.io/liquid/filters/minus)
- [ ] [modulo](https://shopify.github.io/liquid/filters/modulo)
- [ ] [newline_to_br](https://shopify.github.io/liquid/filters/newline_to_br)
- [ ] [plus](https://shopify.github.io/liquid/filters/plus)
- [ ] [prepend](https://shopify.github.io/liquid/filters/prepend)
- [ ] [remove](https://shopify.github.io/liquid/filters/remove)
- [ ] [remove_first](https://shopify.github.io/liquid/filters/remove_first)
- [ ] [replace](https://shopify.github.io/liquid/filters/replace)
- [ ] [replace_first](https://shopify.github.io/liquid/filters/replace_first)
- [ ] [reverse](https://shopify.github.io/liquid/filters/reverse)
- [ ] [round](https://shopify.github.io/liquid/filters/round)
- [ ] [rstrip](https://shopify.github.io/liquid/filters/rstrip)
- [ ] [size](https://shopify.github.io/liquid/filters/size)
- [ ] [slice](https://shopify.github.io/liquid/filters/slice)
- [ ] [sort](https://shopify.github.io/liquid/filters/sort)
- [ ] [split](https://shopify.github.io/liquid/filters/split)
- [ ] [strip](https://shopify.github.io/liquid/filters/strip)
- [ ] [strip_html](https://shopify.github.io/liquid/filters/strip_html)
- [ ] [strip_newlines](https://shopify.github.io/liquid/filters/strip_newlines)
- [ ] [times](https://shopify.github.io/liquid/filters/times)
- [ ] [truncate](https://shopify.github.io/liquid/filters/truncate)
- [ ] [truncatewords](https://shopify.github.io/liquid/filters/truncatewords)
- [ ] [uniq](https://shopify.github.io/liquid/filters/uniq)
- [ ] [upcase](https://shopify.github.io/liquid/filters/upcase)
- [ ] [url_encode](https://shopify.github.io/liquid/filters/url_encode)

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
