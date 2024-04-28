---
title: where_exp
---

{% since %}v10.12.0{% endsince %}

从数组中选择所有表达式值为真的对象。下面的例子中，假设你要从产品列表中筛选出来厨房用品。利用 `where_exp` 可以创建一个只包含 `"type"` 为 `"kitchen"` 的列表。

输入
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign kitchen_products = products | where_exp: "item", "item.type == 'kitchen'" %}

Kitchen products:
{% for product in kitchen_products %}
- {{ product.title }}
{% endfor %}
```

输出
```text
All products:
- Vacuum
- Spatula
- Television
- Garlic press

Kitchen products:
- Spatula
- Garlic press
```

[truthy]: ../tutorials/truthy-and-falsy.html
