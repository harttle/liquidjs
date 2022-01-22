---
title: Differences with Shopify/liquid
---

All filters and tags in [shopify/liquid](https://github.com/Shopify/liquid) are supposed to be built in LiquidJS, but not those business-logic specific tags/filters which are typically from Shopify themes (see [Plugins List][plugins] in case you're looking for them and feel free to add yours to the list). Though being compatible the Ruby version is one of our priorities, there are still some differences:

* Truthy and Falsy. All values except `undefined`, `null`, `false` are truthy, whereas in Ruby Liquid all except `nil` and `false` are truthy. See [#26][#26].
* Number. In JavaScript we cannot distinguish or convert between `float` and `integer`, see [#59][#59]. And when applied `size` filter, numbers always return 0, which is 8 for integer in ruby, cause they do not have a `length` property.
* [.to_liquid()](https://github.com/Shopify/liquid/wiki/Introduction-to-Drops) is replaced by `.toLiquid()`
* [.to_s()](https://www.rubydoc.info/gems/liquid/Liquid/Drop) is replaced by JavaScript `.toString()`
* Iteration order for objects. The iteration order of JavaScript objects, and thus LiquidJS objects, is a combination of the insertion order for string keys, and ascending order for number-like keys, while the iteration order of Ruby Hash is simply the insertion order.
* Sort stability. The [sort][sort] stability is also not defined in both shopify/liquid and LiquidJS, but it's [considered stable][stable-sort] for LiquidJS in Node.js 12+ and Google Chrome 70+.
* Trailing unmatched characters inside filters are allowed in shopify/liquid but not in LiquidJS. It means filter arguments without a colon like `{%raw%}{{ "a b" | split " "}}{%endraw%}` will throw an error in LiquidJS. This is intended to improve Liquid usability, see [#208][#208] and [#212][#212].
* LiquidJS has additional tags: [layout][layout] and corresponding `block` tag.
* LiquidJS has additional filters: [json][json].

[layout]: https://liquidjs.com/tags/layout.html
[json]: https://liquidjs.com/filters/json.html
[#26]: https://github.com/harttle/liquidjs/pull/26
[#59]: https://github.com/harttle/liquidjs/issues/59
[#208]: https://github.com/harttle/liquidjs/issues/208
[#212]: https://github.com/harttle/liquidjs/issues/212
[sort]: https://liquidjs.com/filters/sort.html
[stable-sort]: https://v8.dev/features/stable-sort
[plugins]: ./plugins.html#Plugin-List
