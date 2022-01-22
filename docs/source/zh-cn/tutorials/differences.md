---
title: 和 Shopify/liquid 的区别
---

[Shopify/liquid](https://github.com/Shopify/liquid) 中的所有标签和过滤器 LiquidJS 都支持，但不包括 Shopify 主题中业务逻辑相关的标签和过滤器（如果你在找这些标签可以参考 [插件列表][plugins]，也欢迎把你的插件添加到列表中）。尽管原则上我们尽力兼容于 Shopify/liquid，但仍然存在一些区别：

* 真和假。在 LiquidJS 中 `undefined`, `null`, `false` 是假，之外的都是真；在 Ruby 中 `nil` 和 `false` 是假，其他都是真。见 [#26][#26]。
* 数字。JavaScript 不区分浮点数和整数，因此缺失一部分整数算术，见 [#59][#59]。此外 `size` 过滤器作用于数字时总是返回零，而不是 Ruby 中的浮点数或整数的内存大小。
* Drop 中的 [.to_liquid()](https://github.com/Shopify/liquid/wiki/Introduction-to-Drops) 替换为 `.toLiquid()`。
* 数据的 [.to_s()](https://www.rubydoc.info/gems/liquid/Liquid/Drop) 替换为 `.toString()`。
* 对象的迭代顺序。JavaScript 对象的迭代顺序是插入顺序和数字键递增顺序的组合，但 Ruby Hash 中只是插入顺序（JavaScript 字面量 Object 和 Ruby 字面量 Hash 的插入顺序解释也不同）。
* 排序稳定性。shopify/liquid 和 LiquidJS 都没有定义 [sort][sort] 过滤器的稳定性在，它取决于 Ruby/JavaScript 内置的排序算法，在 Node.js 12+ 和 Google Chrome 70+ LiquidJS 的排序是 [稳定的][stable-sort]。
* shopify/liquid 允许过滤器尾部的未匹配字符，但 LiquidJS 不允许。这就是说如果过滤器参数前忘记写冒号比如 `{%raw%}{{ "a b" | split " "}}{%endraw%}` LiquidJS 会抛出异常。这是为了提升 Liquid 模板的易用性，参考 [#208][#208] 和 [#212][#212]。
* LiquidJS 有额外的标签：[layout][layout] 和相应的 `block`。
* LiquidJS 有额外的过滤器：[json][json]。

[layout]: https://liquidjs.com/tags/layout.html
[json]: https://liquidjs.com/filters/json.html
[#26]: https://github.com/harttle/liquidjs/pull/26
[#59]: https://github.com/harttle/liquidjs/issues/59
[#208]: https://github.com/harttle/liquidjs/issues/208
[#212]: https://github.com/harttle/liquidjs/issues/212
[sort]: https://liquidjs.com/filters/sort.html
[stable-sort]: https://v8.dev/features/stable-sort
[plugins]: ./plugins.html#插件列表
