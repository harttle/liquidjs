---
title: default
---

{% since %}v1.9.1{% endsince %}

在值不存在时给一个默认值，如果左侧是 [falsy][falsy] 或空（`string` 或 `Array`）就会使用这个默认值。下面的例子中 `product_price` 没有定义，因此使用了默认值。

输入
```liquid
{{ product_price | default: 2.99 }}
```

输出
```text
2.99
```

下面的例子中定义了 `product_price` 所以没有使用默认值。

输入
```liquid
{% assign product_price = 4.99 %}
{{ product_price | default: 2.99 }}
```

输出
```text
4.99
```

下面例子中 `product_price` 为空，所以使用了默认值。

输入
```liquid
{% assign product_price = "" %}
{{ product_price | default: 2.99 }}
```

输出
```text
2.99
```

## 允许 `false`

{% since %}v9.32.0{% endsince %}

为了允许让 `false` 直接输出而不是用默认值，可以用 `allow_false` 参数。

输入

```liquid
{% assign display_price = false %}
{{ display_price | default: true, allow_false: true }}
```

输出

```text
false
```

[falsy]: ../tutorials/truthy-and-falsy.html
