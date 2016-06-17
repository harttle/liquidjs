# shopify-liquid

[![NPM version](https://img.shields.io/npm/v/shopify-liquid.svg?style=flat)](https://www.npmjs.org/package/shopify-liquid)
[![Build Status](https://travis-ci.org/harttle/shopify-liquid.svg?branch=master)](https://travis-ci.org/harttle/shopify-liquid)
[![Coverage Status](https://coveralls.io/repos/github/harttle/shopify-liquid/badge.svg?branch=master)](https://coveralls.io/github/harttle/shopify-liquid?branch=master)
[![Dependency manager](https://david-dm.org/harttle/shopify-liquid.png)](https://david-dm.org/harttle/shopify-liquid)

[Liquid][shopify-liquid] implementation for Node.js.
All tags and filters listed in [Shopify Documentation][shopify-liquid]
shall be implemented.

> Shopify liquid is used by [Jekyll][jekyll] and [Github Pages][gh].

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
- [ ] first [Document](https://shopify.github.io/liquid/filters/first) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] floor [Document](https://shopify.github.io/liquid/filters/floor) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] join [Document](https://shopify.github.io/liquid/filters/join) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] last [Document](https://shopify.github.io/liquid/filters/last) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] lstrip [Document](https://shopify.github.io/liquid/filters/lstrip) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] map [Document](https://shopify.github.io/liquid/filters/map) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] minus [Document](https://shopify.github.io/liquid/filters/minus) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] modulo [Document](https://shopify.github.io/liquid/filters/modulo) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] newline_to_br [Document](https://shopify.github.io/liquid/filters/newline_to_br) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] plus [Document](https://shopify.github.io/liquid/filters/plus) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] prepend [Document](https://shopify.github.io/liquid/filters/prepend) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] remove [Document](https://shopify.github.io/liquid/filters/remove) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] remove_first [Document](https://shopify.github.io/liquid/filters/remove_first) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] replace [Document](https://shopify.github.io/liquid/filters/replace) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] replace_first [Document](https://shopify.github.io/liquid/filters/replace_first) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] reverse [Document](https://shopify.github.io/liquid/filters/reverse) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] round [Document](https://shopify.github.io/liquid/filters/round) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] rstrip [Document](https://shopify.github.io/liquid/filters/rstrip) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] size [Document](https://shopify.github.io/liquid/filters/size) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] slice [Document](https://shopify.github.io/liquid/filters/slice) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] sort [Document](https://shopify.github.io/liquid/filters/sort) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] split [Document](https://shopify.github.io/liquid/filters/split) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] strip [Document](https://shopify.github.io/liquid/filters/strip) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] strip_html [Document](https://shopify.github.io/liquid/filters/strip_html) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] strip_newlines [Document](https://shopify.github.io/liquid/filters/strip_newlines) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] times [Document](https://shopify.github.io/liquid/filters/times) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] truncate [Document](https://shopify.github.io/liquid/filters/truncate) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] truncatewords [Document](https://shopify.github.io/liquid/filters/truncatewords) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] uniq [Document](https://shopify.github.io/liquid/filters/uniq) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] upcase [Document](https://shopify.github.io/liquid/filters/upcase) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]
- [ ] url_encode [Document](https://shopify.github.io/liquid/filters/url_encode) [Source](https://github.com/harttle/shopify-liquid/blob/master/filters.js) [Test][ft]

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
