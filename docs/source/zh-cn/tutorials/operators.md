---
title: 运算符
---

LiquidJS 运算符非常简单也很特别，只支持两类运算符：

* 比较运算符：`==`, `!=`, `>`, `<`, `>=`, `<=`
* 逻辑运算符：`not`, `or`, `and`, `contains`

因此普通的数学运算是不支持的，比如 `{% raw %}{{a + b}}{% endraw %}`。它的替代方案是过滤器 `{% raw %}{{ a | plus: b}}{% endraw %}`。事实上 `+` 在 LiquidJS 中是一个合法的变量名。

## 逻辑运算符

### not

对条件取反。如果条件为假则返回 `true`，如果条件为真则返回 `false`。

输入
```liquid
{% if not user.active %}
  用户未激活
{% endif %}
```

### and

当两个条件都为真时返回 `true`。

输入
```liquid
{% if user.age >= 18 and user.verified %}
  允许访问
{% endif %}
```

### or

当至少一个条件为真时返回 `true`。

输入
```liquid
{% if user.isAdmin or user.isModerator %}
  您拥有提升的权限
{% endif %}
```

### contains

检查字符串是否包含子字符串，或数组是否包含元素。

输入
```liquid
{% if product.title contains "Pack" %}
  这是一个套装
{% endif %}
```

## 优先级

1. 比较运算符和 `contains`。所有比较运算符和 `contains` 具有同样的（最高）优先级。
2. `not` 运算符。它的优先级略高于 `or` 和 `and`。
3. `or` 和 `and` 运算符。这些逻辑运算符具有同样的（最低）优先级。

## 结合性

逻辑运算符是右结合的，所以连续的逻辑运算时计算顺序是从右向左，参考 [Shopify][operator-order] 的文档。

[operator-order]: https://help.shopify.com/en/themes/liquid/basics/operators#order-of-operations
