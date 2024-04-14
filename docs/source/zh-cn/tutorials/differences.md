---
title: 和 Shopify/liquid 的区别
---

## 兼容性

LiquidJS 一直很重视兼容于 Ruby 版本的 Liquid。Liquid 模板语言最初由 [Ruby 实现][ruby-liquid]，用于 Shopify，Jekyll 以及 Github Pages，它是 Ruby 里最流行的模板引擎之一。因此由很多人用 LiquidJS 来渲染他们的 Shopify 主题和 Jekyll 站点。

所以“兼容”意味着让这些开发者有很好的使用体验：

- **LiquidJS 应当能够渲染语法正确的 Liquid 模板**。例如 `forloop.index` 应该是 1 开始的下表，`nil` 应该渲染成空字符串而不是 `undefined` 等。即使有些功能（例如 [#236][#236]）用 JavaScript 很难实现，但至少 LiquidJS 会尝试实现所有的 Liquid 语义。
- **所有 [shopify/liquid][ruby-liquid] 里的标签和过滤器 LiquidJS 都要实现**。这之外有些业务逻辑相关的标签/过滤器尤其是 Shopify 平台上的那些，应该维护在 [插件][plugins] 里。但是这其中有一些很有用的标签（比如 `{% layout %}`）LiquidJS 也会考虑实现，可以去开个 Issue 讨论一下。

同时，既然现在用 JavaScript 实现了，那 Liquid 应该有更强的功能：

* **完全支持异步**。所有过滤器和标签都可以实现为异步，只需要返回 `Promise` 即可。
* **同时支持同步**。对一些非 I/O 密集的场景，同步渲染会更快。只要模板包含的标签和过滤器都支持同步，你就可以调用类似 `.renderSync()` 这样的 API。所有内置标签和过滤器都同时支持同步和异步。
* **[抽象文件系统][afs]**。和异步功能一起使用，LiquidJS 可以实现渲染数据库里的模板 [#414][#414]，远程 HTTP 服务器上的模板 [#485][#485]，等等。
* **额外的标签和过滤器**。比如 `layout` 和 `json`。

## 区别

[Shopify/liquid][ruby-liquid] 中的所有标签和过滤器 LiquidJS 都支持，但不包括 Shopify 主题中业务逻辑相关的标签和过滤器（如果你在找这些标签可以参考 [插件列表][plugins]，也欢迎把你的插件添加到列表中）。尽管原则上我们尽力兼容于 Shopify/liquid，但仍然存在一些区别：

* 真和假。在 LiquidJS 中 `undefined`, `null`, `false` 是假，之外的都是真；在 Ruby 中 `nil` 和 `false` 是假，其他都是真。见 [#26][#26]。
* 数字。JavaScript 不区分浮点数和整数，因此缺失一部分整数算术，见 [#59][#59]。此外 `size` 过滤器作用于数字时总是返回零，而不是 Ruby 中的浮点数或整数的内存大小。
* Drop 中的 [.to_liquid()](https://github.com/Shopify/liquid/wiki/Introduction-to-Drops) 替换为 `.toLiquid()`。
* 数据的 [.to_s()](https://www.rubydoc.info/gems/liquid/Liquid/Drop) 替换为 `.toString()`。
* 对象的迭代顺序。JavaScript 对象的迭代顺序是插入顺序和数字键递增顺序的组合，但 Ruby Hash 中只是插入顺序（JavaScript 字面量 Object 和 Ruby 字面量 Hash 的插入顺序解释也不同）。
* 排序稳定性。shopify/liquid 和 LiquidJS 都没有定义 [sort][sort] 过滤器的稳定性在，它取决于 Ruby/JavaScript 内置的排序算法，在 Node.js 12+ 和 Google Chrome 70+ LiquidJS 的排序是 [稳定的][stable-sort]。
* shopify/liquid 允许过滤器尾部的未匹配字符，但 LiquidJS 不允许。这就是说如果过滤器参数前忘记写冒号比如 `{%raw%}{{ "a b" | split " "}}{%endraw%}` LiquidJS 会抛出异常。这是为了提升 Liquid 模板的易用性，参考 [#208][#208] 和 [#212][#212]。
* LiquidJS 比 [Liquid 语言][liquid] 有更多的标签和过滤器：
    * LiquidJS 自己定义的标签：[layout][layout]、[render][render] 和相应的 `block`。
    * LiquidJS 自己定义的过滤器：[json][json]。
    * 从 [Shopify][shopify-tags] 借来的不依赖 Shopify 平台的标签/过滤器。
    * 从 [Jekyll][jekyll-filters] 借来的不依赖 Jekyll 框架的标签/过滤器。

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
[plugins]: ./plugins.html#插件列表
[ruby-liquid]: https://github.com/Shopify/liquid
[afs]: https://liquidjs.com/tutorials/render-file.html#Abstract-File-System
[liquid]: https://shopify.github.io/liquid/basics/introduction/
[shopify-tags]: https://shopify.dev/docs/api/liquid/tags
[jekyll-filters]: https://jekyllrb.com/docs/liquid/filters/
