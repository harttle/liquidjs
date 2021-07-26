---
title: sort_natural
---

{% since %}v8.4.0{% endsince %}

大小写不敏感地对数组元素排序。

输入
```liquid
{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}

{{ my_array | sort_natural | join: ", " }}
```

输出
```text


giraffe, octopus, Sally Snake, zebra
```

有一个参数来指定用元素的哪个属性排序。

```liquid
{% assign products_by_company = collection.products | sort_natural: "company" %}
{% for product in products_by_company %}
  <h4>{{ product.title }}</h4>
{% endfor %}
```
