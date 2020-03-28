---
title: 运算符
---

LiquidJS 运算符非常简单也很特别，只支持两类运算符：

* 比较运算符：`==`, `!=`, `>`, `<`, `>=`, `<=`
* 逻辑运算符：`or`, `and`, `contains`

因此普通的数学运算是不支持的，比如 `{% raw %}{{a + b}}{% endraw %}`。它的替代方案是过滤器 `{% raw %}{{ a | plus: b}}{% endraw %}`。事实上 `+` 在 LiquidJS 中是一个合法的变量名。

## 优先级

1. 比较运算符。所有比较运算符具有同样的优先级，且高于逻辑运算符。
2. 逻辑运算符。所有逻辑运算符具有同样的有衔接。

## 结合性

逻辑运算符是又结合的，所以连续的逻辑运算时计算顺序是从右向左，参考 [Shopify][operator-order] 的文档。

[operator-order]: https://help.shopify.com/en/themes/liquid/basics/operators#order-of-operations
