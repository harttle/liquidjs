---
title: Differences with Shopify/liquid
---

## Compatibility

Being compatible with the Ruby version is one of our priorities. Liquid language is originally [implemented in Ruby][ruby-liquid] and used by Shopify and Jekyll (and thus GitHub Pages). As you can see it's one of the most popular template engines in Ruby. There're lots of people using LiquidJS to serve their templates originally written for Shopify themes and Jekyll sites.

So "being compatible" means serving developers from Shopify and Jekyll well:

- **Well-formed Liquid template should work just fine in LiquidJS**. For example, `forloop.index` should be 1-indexed, `nil` should be rendered as empty string rather than `undefined`, etc. Although some features (e.g. [#236][#236]) are not feasible in JavaScript, at least we're trying to implement all the semantics of Liquid language.
- **All filters and tags in [shopify/liquid][ruby-liquid] are supposed to be built in LiquidJS**. But not those business-logic specific tags/filters typically defined by Shopify platform. Those features should be maintained as [plugins][plugins]. For filters/tags that are not business-logic specific, like `{% layout %}`, and extremely useful, feel free to file an issue.

In the meantime, it's now implemented in JavaScript, that means it has to be more powerful:

* **Async as first-class citizen**. Filters and tags can be implemented asynchronously by return a `Promise`.
* **Also can be sync**. For scenarios that are not I/O intensive, render synchronously can be much faster. You can call synchronous APIs like `.renderSync()` as long as all the filters and tags in template support to be rendered synchronously. All builtin filters/tags support both sync and async render.
* **[Abstract file system][afs]**. Along with async feature, LiquidJS can be used to serve templates stored in Databases [#414][#414], on remote HTTP server [#485][#485], and so on.
* **Additional tags and filters** like `layout` and `json`, `inspect`, `where_exp`, `group_by`, etc., see below for details.

## Differences

Though we're trying to be compatible with the Ruby version, there are still some differences:

* Truthy and Falsy. All values except `undefined`, `null`, `false` are truthy, whereas in Ruby Liquid all except `nil` and `false` are truthy. See [#26][#26].
* Number. In JavaScript we cannot distinguish or convert between `float` and `integer`, see [#59][#59]. And when applied `size` filter, numbers always return 0, which is 8 for integer in ruby, cause they do not have a `length` property.
* [.to_liquid()](https://github.com/Shopify/liquid/wiki/Introduction-to-Drops) is replaced by `.toLiquid()`
* [.to_s()](https://www.rubydoc.info/gems/liquid/Liquid/Drop) is replaced by JavaScript `.toString()`
* Iteration order for objects. The iteration order of JavaScript objects, and thus LiquidJS objects, is a combination of the insertion order for string keys, and ascending order for number-like keys, while the iteration order of Ruby Hash is simply the insertion order.
* Sort stability. The [sort][sort] stability is also not defined in both shopify/liquid and LiquidJS, but it's [considered stable][stable-sort] for LiquidJS in Node.js 12+ and Google Chrome 70+.
* Trailing unmatched characters inside filters are allowed in shopify/liquid but not in LiquidJS. It means filter arguments without a colon like `{%raw%}{{ "a b" | split " "}}{%endraw%}` will throw an error in LiquidJS. This is intended to improve Liquid usability, see [#208][#208] and [#212][#212].
* LiquidJS has more tags/filters than [the Liquid language][liquid]:
    * LiquidJS-defined tags: [layout][layout], [render][render] and corresponding `block` tag.
    * LiquidJS-defined filters: [json][json], group_by, group_by_exp, where_exp, jsonify, inspect, etc.
    * Tags/filters that don't depend on Shopify platform are borrowed from [Shopify][shopify-tags].
    * Tags/filters that don't depend on Jekyll framework are borrowed from [Jekyll][jekyll-filters].
* Some tags/filters behave differently: [date][date] filter, malformed tags (like duplicated `else`, extra args for `endif`) throw errors in LiquidJS. 

[date]: https://liquidjs.com/filters/date.html
[layout]: ../tags/layout.html
[render]: ../tags/render.html
[json]: https://liquidjs.com/filters/json.html
[#26]: https://github.com/harttle/liquidjs/pull/26
[#59]: https://github.com/harttle/liquidjs/issues/59
[#208]: https://github.com/harttle/liquidjs/issues/208
[#212]: https://github.com/harttle/liquidjs/issues/212
[#236]: https://github.com/harttle/liquidjs/issues/236
[#414]: https://github.com/harttle/liquidjs/discussions/414
[#485]: https://github.com/harttle/liquidjs/discussions/485
[sort]: https://liquidjs.com/filters/sort.html
[stable-sort]: https://v8.dev/features/stable-sort
[plugins]: ./plugins.html#Plugin-List
[ruby-liquid]: https://github.com/Shopify/liquid
[afs]: https://liquidjs.com/tutorials/render-file.html#Abstract-File-System
[liquid]: https://shopify.github.io/liquid/basics/introduction/
[shopify-tags]: https://shopify.dev/docs/api/liquid/tags
[jekyll-filters]: https://jekyllrb.com/docs/liquid/filters/
